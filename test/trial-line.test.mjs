/* 35 号试验线服务端/纯函数断言：快照透传诚实形状 + 匹配纯函数红线 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('trial-match 纯函数（new Function 加载）：相关给分/不相关硬性✕/可对照<2 不给百分数/签名不收靶点', () => {
  const src = readFileSync(join(ROOT, 'prototypes/v0.2/trial-match.js'), 'utf8');
  const window = {};
  new Function('window', src)(window);
  const M = window.AhaTrialMatch;
  assert.ok(M, 'AhaTrialMatch 未挂载');
  const good = M.items({ title: 'Acquired hemophilia A registry study', studyType: 'Observational' }, { type: 'observational' });
  const g = M.score(good);
  assert.equal(g.ok, 2); assert.equal(g.m, 2); assert.equal(g.pct, 100);
  const bad = M.items({ title: 'Diabetes bioequivalence study', studyType: 'Interventional' }, { type: 'interventional' });
  const b = M.score(bad);
  /* 不相关=硬性✕ 但类型可对照：诚实低分（严格低于相关项），且 ✕ 排前 */
  assert.ok(b.pct < g.pct, '不相关登记分数必须低于相关登记（b=' + b.pct + ' g=' + g.pct + '）');
  assert.equal(M.sorted(bad)[0].state, '✕');
  const few = M.score(M.items({ title: 'x', studyType: '' }, { type: 'all' }));
  assert.equal(few.pct, null); assert.ok(few.reason.includes('不足 2 条'));
  /* 靶点不进分母：函数签名只有 (facts, prefs)，facts 只读 title/studyType（结构断言） */
  assert.equal(M.items.length, 2);
});

test('Workbench.trialMatch：透传真实快照（205 条）且带诚实口径，不做符合度判读', async () => {
  const { Workbench } = await import(join(ROOT, 'dsh/workbench.js'));
  const { mkdtempSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const root = mkdtempSync(join(tmpdir(), 'aha-trials-'));
  const wb = new Workbench({ root });
  wb.open();
  const r = wb.trialMatch('');
  assert.equal(r.available, true, '快照应随包可用');
  assert.equal(r.total, 205, '快照条数应与 manifest 一致（205）');
  assert.ok(r.honestyNote.includes('未核实'), '透传必须带「登记状态未核实」口径');
  assert.ok(r.honestyNote.includes('需人工核对'), '透传必须带「需人工核对」口径');
  for (const rec of r.records.slice(0, 5)) assert.equal(rec.statusNote, '登记状态，未核实');
  const kw = wb.trialMatch('获得性血友病');
  assert.ok(Array.isArray(kw.records), '关键词过滤返回数组（可能为空，不做判读）');
  wb.close();
});
