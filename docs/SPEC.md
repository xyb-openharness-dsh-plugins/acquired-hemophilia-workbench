# SPEC · 小凝宝 CoagPal · 获得性血友病工作台 v0.1

状态：夜间自动版（G1 自动签认待晨审追认）。0 访谈、0 临床审核。

## 问题、用户与最小闭环
见 BRIEF.md。最小闭环：记出血/化验/治疗 → 看板与指标回顾 → 导出预览带去门诊。

## 方案与 ADR
- ADR-1 原型同形移植 cold-agglutinin v0.2（而非从零造轮子）：事件—化验形态同构、已过 V1/V2；语义逐项替换，残留 grep 0。备选（breast v0.4 直移）否决：肿瘤分期/治疗线语义裁剪成本高于重写数据层。
- ADR-2 非肿瘤无「缓解」词：AHA 的「完全缓解」是医生判定的临床终点（FⅧ:C≥50% 且滴度<0.6），界面状态卡只用「出血中第 N 天 / 距上次出血第 N 天」，避免冒充疗效判定。
- ADR-3 试验线（0.2.0 改判）：M4 快照 205 条采集成功但相关 0 条——按 35 号实现四段链路并诚实展示「相关 0」，优于静默裁剪（裁剪声明会挡住「登记号交给医生核对」的真实路径）；虚构示例 2 条演示交互、明示不含可用登记号。
- ADR-4 方法/机构可比组：aPTT 受试剂影响大（硅土 vs 白陶土 demo B 双机构实例），跨组不合并、不连线、不做差。

## 功能范围
FEATURE-INVENTORY 以 probe LEAF_ROUTES（20 路由）+ 11 条交互路径（INTERACTION-DESIGN）为准；稳定功能 ID：F-DASH, F-BLEED, F-LAB, F-TREAT, F-VISIT, F-REPORT, F-MIND, F-ARCHIVE, F-CLINICAL(裁剪), F-SETTINGS, F-AI, F-PRIMER, F-PV(整页视图), F-EXPORT, F-PROFILE。

## 数据与 API
- 实体：profiles / bleeds / labs / treatments / meds / questions / hospitals / reports / docs / mind(feel,family)。
- 派生值读时算：出血中第 N 天、距上次出血、近 90 天出血次数（不落库、无判读列）。
- 迁移：M3 schema/0001_initial.sql + freeze-contract sha256。

## 疾病概要出口口径
非肿瘤：landscape 固定出口「按受累器官与病情轻重排列」+「不代表任何一项适合你」「需要问你的医生」（probe L13 通过）。

## 验收
npm run check（check 链全绿）+ test + audit + probe-acquired-hemophilia-m2（35 条）+ probe-disease-primer（10 条）+ probe-page-view（13 条），数字进 PROGRESS。
