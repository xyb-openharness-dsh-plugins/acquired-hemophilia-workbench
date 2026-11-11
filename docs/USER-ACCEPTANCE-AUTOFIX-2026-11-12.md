# 用户验收问题自动巡检（USER-ACCEPTANCE-AUTOFIX A–F）· acquired-hemophilia-workbench 0.1.0 · 2026-11-12 00:00

基线：`npm run check` exit 0、`npm test` 34/34、`npm run audit` 44/44（数字照抄）。宿主形态复现：dev-server public 形态（--root ~/Downloads/aha-demo-root，拒绝主目录/下载根/tmp 实测命中）+ Desktop harness 装机（V2 已过）；**真机 UI 点击未做（V3 待人工，按最坏假设已做防御性加固）**。

## DP 疾病概要（？号——每轮必查第一条）
| 项 | 结论 | 证据 |
| --- | --- | --- |
| 顶栏 ？ + aria 四段 | 通过 | probe P1（text="?" label 含定义/趋势） |
| 首页第二入口 | 通过 | M2 P1b entries=2、secondOpened=true、secondFocusBack=true |
| #disease-primer 动态建 DOM | 通过 | primer.js 三件套在 index.html:50-52 加载；probe P2 四段顺序 definition›evidence›landscape›trend |
| 探针显式 --url 打本仓 | 通过 | `--url http://127.0.0.1:8907/prototypes/v0.2/index.html`（原型）与 `http://127.0.0.1:7802/index.html`（public）双形态均 10/10；未跑 starter examples 假绿 |
| check-primer-links | 通过 | 11 项结构 + 未联网 11/11；--http 夜间 SKIP（如实记录） |

## A 设置与弹层
通过：CFG1 断言（弹层打开 + 工作区/文档解析（MinerU）/临床数据库 三 tab 逐字）；侧栏无设置项（index.html 侧栏只有导航+档案+说明）。

## B 功能线完整性
通过：一级 9 页与 cold/breast 并列对照（DIFF-MATRIX）；临床线=如实裁剪（CLIN0 断言：裁剪理由 + 下一步按钮 + 无假检索/假分数，C 类禁词 grep 0：匹配指数/入选概率/eligible/suitability 全站 0 命中）；孤儿页=0（IP2，20 路由非空）。

## C 试验匹配红线
不适用（如实裁剪）——C1–C6 判据不评；裁剪声明三处同口径（clinicalNotice / setClinical / docs/CLINICAL-DATA.md），快照 0 条如实。

## D 指标卡与指标体系
- 覆盖度：凝血与抑制物（APTT/FVIII/INH）+ 血象（Hb/WBC/PLT）+ 体征（体重）三组 7 指标，指南随访监测口径对齐（IST 期间每周监测血常规/电解质→血象组；无捏造指标组）。通过（TILE1=7、MC1 n=7/groups=3）。
- 翻转：双通道 aria-pressed + .flipped + matrix3d rotateY(-1)（FLIP2 断言；先归零再点防前序污染）；定高 194±1、同网格差 ≤1px（MT07）；DOM 不变/焦点保持（C11/C12）。

## E 录入窗口（F 系盘点）
| 页面 | ＋入口 | 表单 | 三态保存 | 字段 |
| --- | --- | --- | --- | --- |
| 出血（events/list） | ✓ ADD1 | #form-bleed ✓ | ✓ | 5（≤6） |
| 化验（labs/list） | ✓ | #form-lab ✓ | ✓ | 6（≤6） |
| 治疗（treatment/log） | ✓ | #form-treat ✓ | ✓ | 4 |
| 就诊问题（visits/prep） | ✓ | #form-q ✓ | ✓ | 1 |
| 报告（reports/list） | ✓ | #form-report ✓ | ✓ | 5 |
| 感受/家人（mind） | ✓ | #form-feel/#form-family ✓ | ✓ | 3 |
| 就医信息 | ✓（添加一家医院） | #form-hosp ✓ | 两态（保存/取消） | 3 |
数字键盘 inputmode=decimal（labForm 结果字段）；空态全部带下一步按钮（探针渲染非空 + 空态 CTA 在列）。

## F 修复铁律
本轮无修复轮（0 轮返工）；改包未升版（0.1.0 首发）；演示唯一源（demo-data.js，parity 34/34 含 canonical 全字段断言）；门禁全绿；装机 tgz sha256 与包内清单已记（V2V3 签认）。

## 待人工
1. Desktop 真机点击（AI 对话/取消选目录/失败提示/开合）。
2. check-readme-assets 检查器家族仓不存在（33 号点名）——README 6 张截图人工核对通过，未写「检查器通过」。
