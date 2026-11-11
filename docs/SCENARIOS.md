# SCENARIOS · 场景清单（全部为合成示例 + 待访谈核实假设）

| ID | 场景 | 一期 | 页面落点 | 验收 |
| --- | --- | --- | --- | --- |
| S01 | 确诊后第一周：把住院期间的化验逐条录进来 | ✅ | labs/list + labForm | probe ADD2 |
| S02 | 出血刚止住：补一条结束日期 | ✅ | events/list | probe Q10 |
| S03 | 复诊前：整理凝血趋势给医生看 | ✅ | labs/chart + records/metrics | probe C1a/C8 |
| S04 | 激素减量节点：记一笔调药 | ✅ | treatment/log | probe ADD1 |
| S05 | 想问医生的问题随手记 | ✅ | visits/prep | probe ADD1 |
| S06 | 拿到新化验单：登记报告并标注原件状态 | ✅ | reports/list + wall | probe ADD2 |
| S07 | 出血加重时的深夜：看医生行动计划原话 | ✅ | dash 行动卡 | Q19/check-wording |
| S08 | 家属代记一条观察记录 | ✅ | mind/family | probe ADD1 |
| S09 | 听说某项登记研究 | 裁剪 | clinical/notice | probe CLIN0 |
| S10 | 切换两套演示档案对比记录密度 | ✅（演示） | profiles 弹窗 | probe Q9/Q10 |
| S11 | 检查私密记录不出现在导出/AI | ✅（红线） | mind/feel 私密切换 | probe Q35a/b/c |

孤儿页=0（probe IP2 20 路由全非空）；暂缓项：MinerU 解析（未接入，如实标注）、试验匹配（裁剪）。
