# DEV-PLAN · acquired-hemophilia-workbench

## 领取与理由
- 认领：BACKLOG 快照（2026-11-11 23:05 拉取）→ Issue #71（claim+claimed）→ 私有仓 `xyb-openharness-dsh-plugins/acquired-hemophilia-workbench`。
- 选择理由：T0/T1 池已全部被认领（逐条核对 BACKLOG 与 issue 列表，2026-11-11）；T2 中按「随访天然结构化 + 与已有仓差异化」选本条：
  1) 随访数据强结构化（aPTT / FⅧ:C / 抑制物滴度 / 血红蛋白按周期复测；出血按事件）；
  2) 家族内无任何凝血/出血病种仓（TTP=血栓微血管病、vWD 未开工、CLL 等肿瘤线语义不同）；
  3) 成人病种，不触发儿童线家长主体约束；4) 夜班 9h 可完成的事件—化验同形移植。

## 里程碑与时间盒（23:00–08:00）
- M0 23:05–23:25（完成：领取/init/接线/基线 check staticPass=true）
- M1 23:25–00:20（本文件 + 文档九件 + G1 自动签认）
- M2 00:20–02:30（原型 v0.2 + 探针 + 独立评审项自查 + G2 自动签认）※ 实际提前：原型于 23:59 落地
- M3 schema + M4 裁剪留证 + M5 开发版移植 + V1 → 02:30–05:30
- M6 装机核对 + V2/V3 → 05:30–07:00
- M7/M8 草稿（不发布）+ M9 回流 → 07:00–07:40；MORNING-REVIEW → 08:00

## 移植基准（写进文档，不抄病种语义）
- 客户端链路/原型同形底本：cold-agglutinin-workbench v0.2（R2 非肿瘤、事件—化验形态、已过 V1/V2，含 AI 面板与 primer 修复）；成熟对比基准：breast-cancer-workbench prototypes/v0.4；结构基准：aml-workbench v0.2 #mind。
- 语义替换原则：发作→出血发作；缓解→出血停止；冷凝集素滴度→抑制物滴度；输血加温→避免肌注等本病原话；禁词扫描残留 0。

## 风险与回退
- 免费模型额度紧张：命令输出全部截断、只重试 2 次。
- DSH Desktop 装机失败：如实写未验证，不阻塞 M9 回流。
