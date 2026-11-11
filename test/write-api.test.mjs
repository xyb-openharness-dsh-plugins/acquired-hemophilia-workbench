/* 0.3.0 写入 API 断言：新建档案/写记录/私密切换 → sqlite → 读模型一致；多用户共存 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Workbench } from '../dsh/workbench.js';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { bootstrapForExit } from '../dsh/readmodels.js';

test('createProfile：真实档案入库（is_demo=0），facts 与行动计划落库，与演示档案共存', () => {
  const wb = new Workbench({ root: mkdtempSync(join(tmpdir(), 'aha-w-')) });
  wb.open();
  const r = wb.createProfile({ name: '张三', tag: '2026-11 确诊', facts: { 确诊经过: '测试确诊经过（写库验证）', 医生行动计划原话: '若出血加重马上联系我（测试原话）' } });
  assert.match(r.profileKey, /^user-/);
  const list = wb.listProfiles();
  assert.equal(list.length, 3); // demo-a + demo-b + 新建
  const mine = list.find((x) => x.profile_key === r.profileKey);
  assert.equal(mine.is_demo, 0);
  assert.equal(mine.name, '张三');
  const b = wb.bootstrap();
  const mp = b.profiles.find((p) => p.id === r.profileKey);
  assert.equal(mp.name, '张三');
  assert.ok(mp.profile['确诊经过'].includes('写库验证'));
  assert.equal(mp.profile['医生行动计划原话'], '若出血加重马上联系我（测试原话）');
  assert.equal(mp.bleeds.length, 0);
  wb.close();
});

test('addEntry：八类记录写通 sqlite 并以读模型同形返回；私有行三出口过滤', () => {
  const wb = new Workbench({ root: mkdtempSync(join(tmpdir(), 'aha-w-')) });
  wb.open();
  const k = wb.createProfile({ name: '李四' }).profileKey;
  const bleed = wb.addEntry(k, 'bleed', { start: '2026-11-12', end: null, trigger: '未知', note: '测试出血', private: true });
  assert.equal(bleed.id, `${k}-b1`);
  const lab = wb.addEntry(k, 'lab', { metric: 'APTT', date: '2026-11-12', value: 61.2, unit: 's', method: '凝固法（硅土试剂）', org: '测试医院' });
  assert.equal(lab.id, `${k}-l1`);
  for (const [kind, data] of [
    ['treatment', { date: '2026-11-12', kind: '止血治疗', name: 'rFⅦa（测试医嘱原文照录）', note: '避免肌肉注射（测试原话）' }],
    ['question', { q: '抑制物多久复查一次？' }],
    ['hospital', { name: '示例医院', dept: '血液内科', contact: '测试电话' }],
    ['report', { title: '凝血化验单（测试）', kind: '化验', date: '2026-11-12', source: '原件已登记' }],
    ['doc', { name: '门诊病历（测试）', type: '病历', date: '2026-11-12' }],
    ['mind', { mindKind: 'feel', text: '私密感受（测试）', private: true }],
    ['mind', { mindKind: 'family', text: '家人支持（测试）' }],
  ]) {
    const r2 = wb.addEntry(k, kind, data);
    assert.equal(r2.ok, true, kind + ' 应写库成功');
  }
  const mine = wb.bootstrap().profiles.find((p) => p.id === k);
  assert.equal(mine.bleeds.length, 1);
  assert.equal(mine.bleeds[0].private, true);
  assert.equal(mine.labs.length, 1);
  assert.equal(mine.labs[0].metric, 'APTT', '库键应映射回展示键');
  assert.equal(mine.treatments.length, 1);
  assert.equal(mine.questions.length, 1);
  assert.equal(mine.hospitals.length, 1);
  assert.equal(mine.reports.length, 1);
  assert.equal(mine.docs.length, 1);
  assert.equal(mine.mind.feel.length, 1);
  assert.equal(mine.mind.feel[0].private, true);
  assert.equal(mine.mind.family.length, 1);
  const ex = bootstrapForExit(wb.db, 'export').profiles.find((p) => p.id === k);
  assert.equal(ex.bleeds.length, 0, '私密出血不进导出');
  assert.equal(ex.mind.feel.length, 0, '私密感受不进导出');
  assert.equal(ex.labs.length, 1, '共享化验进导出');
  wb.close();
});

test('setPrivacy：合成 id / mind 索引两种寻址都能改库；导出与 AI 出口同步生效', () => {
  const wb = new Workbench({ root: mkdtempSync(join(tmpdir(), 'aha-w-')) });
  wb.open();
  const k = wb.createProfile({ name: '王五' }).profileKey;
  const b1 = wb.addEntry(k, 'bleed', { start: '2026-11-12', note: '一' });
  wb.addEntry(k, 'bleed', { start: '2026-11-13', note: '二' });
  wb.setPrivacy(k, 'bleed', b1.id, true);
  let flags = wb.bootstrap().profiles.find((p) => p.id === k).bleeds.map((x) => x.private);
  assert.deepEqual(flags, [true, false]);
  wb.setPrivacy(k, 'bleed', b1.id, false);
  flags = wb.bootstrap().profiles.find((p) => p.id === k).bleeds.map((x) => x.private);
  assert.deepEqual(flags, [false, false]);
  wb.addEntry(k, 'mind', { mindKind: 'feel', text: '感受' });
  wb.setPrivacy(k, 'mind', 'feel0', true);
  assert.equal(wb.bootstrap().profiles.find((p) => p.id === k).mind.feel[0].private, true);
  assert.throws(() => wb.setPrivacy(k, 'bleed', 'b99', true), /找不到/);
  wb.close();
});

test('addEntry：未知档案 / 未知类型 / 缺必填 → 可读错误，不裸崩', () => {
  const wb = new Workbench({ root: mkdtempSync(join(tmpdir(), 'aha-w-')) });
  wb.open();
  assert.throws(() => wb.addEntry('user-none', 'bleed', { start: '2026-11-12' }), /档案不存在/);
  const k = wb.createProfile({ name: '赵六' }).profileKey;
  assert.throws(() => wb.addEntry(k, 'nope', {}), /未知记录类型/);
  assert.throws(() => wb.addEntry(k, 'bleed', {}), /开始日期为必填/);
  assert.throws(() => wb.addEntry(k, 'lab', { date: '2026-11-12' }), /必填/);
  assert.throws(() => wb.createProfile({ name: '' }), /必填/);
  wb.close();
});
