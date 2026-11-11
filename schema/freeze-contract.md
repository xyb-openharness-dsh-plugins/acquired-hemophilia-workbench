# freeze-contract · acquired-hemophilia-workbench

- 冻结文件：schema/0001_initial.sql
- sha256：`ffbff127ecec431550fa2e5d85b0fb8e868f1f20b01bfe2a6683f17a05b1cd0a`
- 冻结时间：2026-11-12 00:20（M3 · 夜间无人值守）
- 纪律：G3 后结构变更只能新增 000N_*.sql；改冻结文件会被 check 拦下。判读列断言（check-schema-words）已入 check 链。
- 表清单（18）：档案级 2（subjects / section_titles）· 指标 3（metric_defs / lab_results / metric_group_titles）· 通用 7（reports / hospitals / visit_questions / mind_notes / viewpoints / documents / meds）· 专属 3（bleed_events / treatment_events / profile_facts）· 导入 3（import_batches / import_candidates / import_conflicts）
