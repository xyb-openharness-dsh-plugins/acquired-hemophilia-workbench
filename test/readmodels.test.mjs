/* 读模型测试：派生值读时算不落库、私密三出口过滤、ORDER BY rowid 稳定读序（获得性血友病语义） */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function freshDb() {
  const db = new DatabaseSync(':memory:');
  for (const f of readdirSync(join(ROOT, 'schema')).filter((f) => /^\d{4}_.*\.sql$/.test(f)).sort()) {
    db.exec(readFileSync(join(ROOT, 'schema', f), 'utf-8'));
  }
  return db;
}

async function seeded() {
  const db = freshDb();
  const demo = await import(join(ROOT, 'dsh/demo.js'));
  demo.seedDemoData(db);
  const rm = await import(join(ROOT, 'dsh/readmodels.js'));
  return { db, rm };
}

test('派生值读时算：出血中/距上次出血第 N 天 / 近 90 天次数（以演示 TODAY 2026-11-11 复算）', async () => {
  const { db, rm } = await seeded();
  const st = rm.readDerivedStatus(db, 'demo-a', '2026-11-11');
  /* A 档案共享出血两次，b-b2 自 2026-11-08 出血中 → 出血中第 4 天 */
  assert.equal(st.mode, '出血中');
  assert.equal(st.dayN, 4);
  assert.equal(st.nearCount, 2); /* 两次都在近 90 天窗口内 */
  assert.equal(st.privateBleeds, 0);

  const b = rm.readDerivedStatus(db, 'demo-b', '2026-11-11');
  /* B 档案 7 次出血中 1 次私密：聚合只用共享 6 次；b-b6 自 2026-11-06 出血中 → 第 6 天 */
  assert.equal(b.privateBleeds, 1);
  assert.equal(b.mode, '出血中');
  assert.equal(b.dayN, 6);
  assert.equal(b.nearCount, 2); /* 近 90 天窗口自 2026-08-13 起：共享 2026-08-14 与 2026-11-06 */
});

test('派生值：私密出血不进聚合（共享口径）', async () => {
  const { db, rm } = await seeded();
  const shared = db.prepare("SELECT COUNT(*) c FROM bleed_events WHERE profile_key='demo-b' AND is_private=0").get().c;
  const st = rm.readDerivedStatus(db, 'demo-b', '2026-11-11');
  /* 近 90 天窗口自 2026-08-13 起：共享 08-14 与 11-06 */
  assert.equal(shared, 6);
  assert.equal(st.nearCount, 2);
});

test('派生值：出血中形态（插入一条 end 为 NULL 的共享出血）', async () => {
  const { db, rm } = await seeded();
  db.prepare("INSERT INTO bleed_events (profile_key, start_date, end_date, trigger_text, note, is_private, ver) VALUES ('demo-a', '2026-10-01', NULL, '测试诱因', '测试出血中', 0, 1)").run();
  const st = rm.readDerivedStatus(db, 'demo-a', '2026-11-11');
  /* 行序语义与 app.js derivedStatus 一致：出血中取记录序第一条未结束出血（a-b2 2026-11-08）→ 第 4 天；
     新插入的共享未结束行使 nearCount 2→3（私密行不计，见上一测试） */
  assert.equal(st.mode, '出血中');
  assert.equal(st.dayN, 4);
  assert.equal(st.nearCount, 3);
});

test('三出口：export/ai 出口在读模型层剥掉全部私密行；dashboard 返回全量含标记', async () => {
  const { db, rm } = await seeded();
  for (const exit of ['export', 'ai']) {
    const b = rm.bootstrapForExit(db, exit);
    for (const p of b.profiles) {
      for (const x of [...p.bleeds, ...p.labs, ...p.treatments, ...p.questions, ...p.reports]) {
        assert.equal(x.private, false, `${exit} 出口存在私密行：${p.id} ${x.id}`);
      }
      for (const x of [...p.mind.feel, ...p.mind.family]) {
        assert.equal(x.private, false, `${exit} 出口存在私密心记：${p.id} ${x.d}`);
      }
    }
    const bb = b.profiles.find((p) => p.id === 'demo-b');
    assert.equal(bb.bleeds.length, 6, 'B 档案 export/ai 出口只剩 6 条共享出血');
  }
  const full = rm.bootstrapForExit(db, 'dashboard');
  const fb = full.profiles.find((p) => p.id === 'demo-b');
  assert.equal(fb.bleeds.length, 7, 'dashboard 全量（页面显示私密徽标）');
});

test('读序稳定：两次 readBootstrap 输出逐字节一致（ORDER BY rowid）', async () => {
  const { db, rm } = await seeded();
  const a = JSON.stringify(rm.readBootstrap(db));
  const b = JSON.stringify(rm.readBootstrap(db));
  assert.equal(a, b);
  /* 反向插入一行后，旧行序不变、新行在尾部 */
  db.prepare("INSERT INTO lab_results (profile_key, metric_key, measured_on, value, unit, method, org, is_private, ver) VALUES ('demo-a', 'aptt', '2026-11-05', 55.2, 's', '凝固法（硅土试剂）', '示例市第一医院', 0, 1)").run();
  const again = rm.readBootstrap(db);
  const labs = again.profiles.find((p) => p.id === 'demo-a').labs;
  assert.equal(labs[labs.length - 1].date, '2026-11-05');
  assert.equal(labs[0].date, '2026-10-21');
});

test('section_titles / metric_defs 读出（分节标题进表，不用 subjects 平铺列）', async () => {
  const { db, rm } = await seeded();
  db.prepare("INSERT INTO section_titles (profile_key, key, title, ord) VALUES ('demo-a', 'labs', '凝血与滴度', 0)").run();
  const titles = rm.readSectionTitles(db, 'demo-a');
  assert.equal(titles.length, 1);
  assert.equal(titles[0].title, '凝血与滴度');
  const defs = rm.readMetricDefs(db);
  assert.deepEqual(defs.map((m) => m.title), ['APTT', 'FVIII', 'INH', 'Hb', 'WBC', 'PLT', '体重']);
});
