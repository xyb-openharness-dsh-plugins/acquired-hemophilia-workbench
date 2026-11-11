# PROGRESS · acquired-hemophilia-workbench（小凝宝 CoagPal）

> 更新：2026-11-12 00:05 · 夜班无人值守（2026-11-11 23:00 开工）· 认领 Issue #71（claimed）· 当前里程碑 M0–M9 全链走完

## 当前里程碑：M9 回流完成；全部闸口为「自动签认（待晨审追认）」；V3 UI 点击走查待人工

## 已完成
- M0（c26cb1c）：BACKLOG 快照 → Issue #71（claim+claimed，模板 404 → 按既有 issue 格式手写 + claim 标签 + 机器人 claimed 确认）→ 私有仓 → `dsh-wb-cli init`（239 文件）→ `cordis.patch.yml` 补 `config.root: !!js dshHomePath('acquired-hemophilia')` → PROGRESS 首行 → 基线 check
- M1（75c153a）：医学原件逐页核对（卫健委《86 个罕见病病种诊疗指南（2025 年版）》第 2 条 p5–10，本机 PDF 517 页提取）→ EVIDENCE-LEDGER 9 条；0 访谈如实；文档九件；DIFF-MATRIX 一级重名率实测 11% ≤70%；G1 自动签认
- M2（20a1984 + 5f2ce67）：原型 v0.2 四件套 + primer 三件套（移植底本 cold-agglutinin，语义逐项重写，残留 grep 0）；两套合成档案 A（刚确诊）/B（多年随访，跨方法双机构）；探针显式 --url：primer 10/10、page-view 13/13、M2 38/38（双形态复跑）；G2 自动签认。修复轮 1 次：M2 探针 Q10 断言引用错键（b.bleeds 应为返回键 b.flaps）——被探针自身抓出，修断言不改实现，复跑 38/38
- M3/M4（7361801）：schema/0001（18 表，判读列 0）+ freeze-contract sha256=ffbff127…；试验线如实裁剪（快照 0，理由三处同口径）；G3 自动签认
- M5（c67108f）：dsh 七件 + src→lib（551 行）+ apiBase 双形态回归 + MinerU 六部件（未接通形态如实）+ public 定点移植 + ui-parity；check exit 0、test 34/34、audit 44/44；V1 自动签认
- M6（81c073b）：0.1.0 tgz 41 files（sha256 1db37290…）→ 标准 pnpm 装 DSH Desktop harness profile → bundles 73 项 → 启动 Desktop → verify-desktop-load 通过（宿主清单含本工作台）→ 真机库直查 20 表全建、演示数据灌库；V2 通过、V3 服务层已验/UI 待人工
- M7/M8（草稿，未发布）：release notes 与 BACKLOG 回填 PR body 存 docs/release-draft/
- M9（5f2ce67 + starter 236bf61）：回流 4 项——starter build-client 模板 id 改 package.json 派生（修 pemphigus 残留）、check-ui-parity trial-match 改存在性可选、check-derivative-leftovers 词表追加 3 组底本 + 自病种排除、LESSONS L89；starter check-starter 229 files pass、test 67/67；本仓 check 链含 10 条 AI 面板契约断言
- README：五段结构 + 6 张实渲截图（含指标卡收/展态，文件名含 v0.1.0）

## 各闸口结论
| 闸口 | 结论 |
| --- | --- |
| G1/G2/G3 | 通过（自动签认待晨审追认，见 docs/signoffs/） |
| V1 | 通过（自动签认） |
| V2 | 通过（自动签认；verify-desktop-load + 真机库直查） |
| V3 | 服务层已验 · UI 级走查待人工（Desktop 无远程调试端口） |

## 数字汇总
- check 链 exit 0（staticPass=true，20 项检查器）；test 34/34；audit 44/44（0 失败 0 待人工）
- 探针：M2 38/38（原型与 public 双形态各一遍，新增 MT12 三档+大字、MT14 120 条压力记录断言）· primer 10/10（双形态）· page-view 13/13（双形态）
- 包：41 files；tgz sha256 1db37290282787d9cac1d66aacba29325a5bb5c2884c6ce39c518d66c59f4a14

## 下一步（晨审）
1. 追认全部自动签认与 DEV-REQUIREMENTS §五默认值（含品牌占位名「小凝宝 CoagPal」）
2. Desktop 新建会话走查 UI（V3）+ 真机截图增补 README
3. M7 发布授权（tag v0.1.0 + release）与 M8 BACKLOG 回填 PR（草稿在 docs/release-draft/）
4. 可推翻项：临床试验线裁剪决定（如需 35 号四段链路可后续补）

## 阻塞
无
