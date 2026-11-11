# MORNING-REVIEW · 2026-11-11/12 夜班（23:00–08:00 无人值守 · 实际主链 23:00–00:15 完成，余量用于加固与巡检）

## 一、一句话结论
新病种 **acquired-hemophilia-workbench（小凝宝 CoagPal · 获得性血友病 AHA）** 已走完 M0–M9 全链并推送：check 链 exit 0、test 34/34、audit 44/44、探针 M2 38/38 + primer 10/10 + page-view 13/13（原型与 public 双形态）、0.1.0 已装入 DSH Desktop harness profile 且宿主加载成功（V2 通过）；V3 UI 点击走查待人工。另完成两件点名任务：cold-agglutinin AI 会话激活九条复核（0.2.2，检查器 7→10 条）、breast-cancer v0.4 疾病概要实跑修复（10/10）。

## 二、原型审查入口（怎么打开、看什么）
- 原型：`prototypes/v0.2/index.html`（直接双击可开；或 `python3 -m http.server` 后访问）。两套演示档案 A（刚确诊记录少）/B（多年随访记录多）侧栏切换。
- 截图：`docs/screenshots/v0.1.0-*.png` 6 张（看板/出血区间带/一图秀/指标卡收+展/疾病概要四段）。
- 走查清单：README「关键功能」五张图即五个必看点；`？` 按钮与首页「疾病概要」双入口都点一遍；设置弹层三 tab；A/B 切换后看状态卡与一图秀是否换数据。
- 装机形态：DSH Desktop → 小凝宝 CoagPal（数据目录 `~/Library/Application Support/dsh-desktop/harness/acquired-hemophilia/`）。

## 三、自动签认清单（全部待晨审追认）
| 文件 | 结论 |
| --- | --- |
| docs/signoffs/G1-自动签认.md | 通过（待追认）：10 主题医学原件核对（指南 p5–10 逐页）、差异化矩阵 5 条、重名率 11% |
| docs/signoffs/G2-自动签认.md | 通过（待追认）：探针三套全绿（显式 --url）、孤儿页 0、禁词 0、残留 0 |
| docs/signoffs/G3-自动签认.md | 通过（待追认）：18 表、判读列 0、freeze sha256 ffbff127… |
| docs/signoffs/V1-自动签认.md | 通过（自动签认）：check/test/audit 全绿 + 双形态实测 |
| docs/signoffs/V2V3-自动签认.md | V2 通过（装机+真机库直查）；V3 服务层已验、UI 走查待人工 |
| cold-agglutinin docs/signoffs/AI-PANEL-0.2.1-自动签认.md | 维持；本轮 0.2.2 复核轮无客户端行为变化 |

## 四、待用户决策项
1. **品牌占位名**「小凝宝 CoagPal」（DEV-REQUIREMENTS §五）：与小宁宝（TTP）同音不同字，若嫌近可改名。
2. **服务主体默认值**：成人 AHA 患者+家属代记；不覆盖儿童先天血友病（§五 1）。
3. **试验线裁剪**：AHA 不建试验匹配线（理由三条，CLINICAL-DATA §试验线裁剪）；如要保留可按 35 号补。
4. **M7 发布授权**：tag v0.1.0 + GitHub release（notes 草稿 docs/release-draft/）；**M8** BACKLOG #2 行回填 PR（body 草稿同目录）——无人值守未发布/未推送 PR。
5. cold-agglutinin 0.2.2 是否重装 Desktop profile（本轮客户端零行为变化未重装，profile 内仍为 0.2.1）。

## 五、消耗
- 时长：23:00–00:20 主链 + 加固巡检至 ~00:45（远低于时间盒；免费模型额度未触顶）。
- token：客户端可见数据未取得（写「未取得」）；命令输出全程截断 ≤4000 字节。

## 六、未验证与异常
1. **V3 UI 级走查未做**：Desktop 无远程调试端口，无法自动点击「AI 对话/取消选目录/失败提示/开合」——需用户新建会话后逐条点（AI-PANEL 与 V2V3 签认同口径）。
2. **装机告警**：check-install 提示「无市场安装记录（手工/native 安装）」；pnpm 安装时 dshmarket 有 peer 警告（宿主既有状态，非本包引入）。
3. **breast-cancer-workbench 本仓工作树有大量既有删除态文件**（git status ' D'：docs/review/v0.3 截图、prototypes/v0.3 assets 等）——非本轮改动，未提交任何 breast 仓变更；本轮只补回 prototypes/v0.4/assets/brand/ 两张缺失品牌图（从其自有 0.13.5 tgz 提取），修后 v0.4 primer 探针 10/10。
4. **修复轮记录**：M2 探针 Q10 断言键名错（b.bleeds vs 返回键 flaps）——探针自查抓出，改探针不改实现，复跑 38/38；不属修绿。
5. check-primer-links --http 夜间 SKIP（如实）；check-readme-assets 检查器家族无此件，README 截图为人工核对。
6. 冷备：M4 试验快照未采集（裁剪），`check-trial-snapshot --if-present` SKIP。
