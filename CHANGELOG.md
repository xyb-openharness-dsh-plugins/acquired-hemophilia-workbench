# 变更记录

只增不删；每条写清"改了什么 + 为什么 + 用户可见结果"。版本号与 VERSION、package.json 三处必须一致。

## 0.1.0 — 2026-11-12（M0–M9 全链 · 夜间无人值守）

- 认领 Issue #71（获得性血友病 AHA · 罕见病 #2 · T2）并建私有仓；dsh-wb-cli init + config.root 接线。
- 原型 v0.2：AHA 语义全量（状态卡「出血中第 N 天/距上次出血第 N 天」、出血发作—诱因登记、止血/免疫抑制/调药按次登记（医嘱原话照录）、APTT/FⅧ:C/抑制物滴度/血象/体征三组 3D 指标卡、一图秀（跨方法不合并）、疾病概要四段（卫健委 2025 版指南原件核验 p5–10）、两套合成档案 A/B）；临床试验线如实裁剪（设置·临床数据库 tab 有声明）。
- 开发版：dsh 七件 + src→lib 客户端链路 + apiBase 交界契约（双形态回归）+ MinerU 六部件（未接通形态，如实标注「勾选与保存不联网」）。
- 数据：schema 0001 冻结（18 表，判读列 0，freeze-contract sha256 ffbff127…）；临床试验快照未采集（裁剪，理由见 docs/DEV-REQUIREMENTS §三）。
- 门禁：check 链 exit 0（staticPass=true）、test 34/34、audit 44/44、探针 35/35 + 10/10 + 13/13（显式 --url 指向本仓原型与 public 双形态）。
- 装机：0.1.0 tgz（sha256 1db37290…）标准 pnpm 装入 DSH Desktop harness profile + bundles 73 项 + 重启后宿主清单含本工作台 + 真机库直查演示数据灌库；V3 UI 点击走查待人工。
- 用户可见结果：DSH Desktop 重启后可打开「小凝宝 CoagPal」工作台查看与录入（演示数据形态，直到导入真实资料）。
