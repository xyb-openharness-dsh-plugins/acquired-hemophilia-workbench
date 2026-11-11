# research/acquired-hemophilia · M4 临床快照四件套（2026-11-12）

- 采集入口：`scripts/fetch-acquired-hemophilia-trials-2026.mjs`（unified-trial-mcp stdio，绝不自己拼 URL；四在线通道终态见 manifest.json `perQuery`/source_statuses 表）
- 四件套：manifest.json / trials-2026.jsonl（205 行）/ acquired_hemophilia_trials_2026.sqlite（trials 205 + source_statuses 24）/ 本 README
- 对账：`node scripts/check-trial-snapshot.mjs .`（manifest=jsonl=sqlite 计数与 sha256 逐字段一致）
- **诚实结论**：205 条里登记题目与获得性血友病相关的 **0 条**。通道终态：chinadrugtrials SUCCESS 200 条（均无关）、ctv SUCCESS 5 条（均无关，「acquired hemophilia」关键词 NO_RESULTS）、ictrp TIMEOUT/FAILED×3、chictr_online FAILED（未查过不计覆盖）。
- 「相关 0」≠「没有研究」： ClinicalTrials.gov 官方 API 用 query.term="acquired hemophilia" 实测命中 30 条（2026-11-12 夜间核验，含登记研究 NCT03199794 等），但家族唯一采集入口 unified-trial-mcp 的 ctv 通道对本病召回不可用——缺口如实记录，不冒充已查过；界面候选池按「相关 0」诚实展示。
- 用途：开发版 `Workbench.trialMatch` 透传（total 与 manifest 对账）；界面 35 号四段链路以「虚构示例 2 条 + 真实快照抽样 + 相关 0」演示与陈述。
