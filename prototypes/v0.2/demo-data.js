/* 演示数据（唯一源）· 两组合成档案 · 获得性血友病（AHA）
 * A：刚确诊、记录少、多处未知；B：多年随访、出血多次、指标与治疗都多。
 * 全部为合成示例，不冒充真实病历；页面不写死数字，一切从这里读。
 * 本文件只放数据，不放逻辑；TODAY 由 app.js 固定为 2026-11-11。
 * 界面阈值一律【待核】；本文件不写参考范围，不写判读。
 */
window.DEMO_DATA = {
  TODAY: '2026-11-11',
  /* 指标元数据（唯一源）：app.js 与服务端 metric_defs 都从这里读；阈值一律不在此出现 */
  metricDefs: [
    { key: 'APTT', db: 'aptt', title: 'APTT（活化部分凝血活酶时间）', category: 'coag', unit: 's', color: '#2f6f8f', ord: 0 },
    { key: 'FVIII', db: 'fviii', title: 'Ⅷ因子活性（FⅧ:C）', category: 'coag', unit: '%', color: '#c96f2f', ord: 1 },
    { key: 'INH', db: 'inh', title: 'Ⅷ因子抑制物滴度', category: 'coag', unit: 'BU/mL', color: '#a3405e', ord: 2 },
    { key: 'Hb', db: 'hb', title: '血红蛋白（Hb）', category: 'hemogram', unit: 'g/L', color: '#2e7d5b', ord: 3 },
    { key: 'WBC', db: 'wbc', title: '白细胞（WBC）', category: 'hemogram', unit: '×10⁹/L', color: '#5a7d2a', ord: 4 },
    { key: 'PLT', db: 'plt', title: '血小板（PLT）', category: 'hemogram', unit: '×10⁹/L', color: '#6b5b95', ord: 5 },
    { key: '体重', db: 'weight', title: '体重', category: 'vitals', unit: 'kg', color: '#b98a1f', ord: 6 }
  ],
  metricGroups: [
    { key: 'coag', title: '凝血与抑制物（复测）', items: ['APTT', 'FVIII', 'INH'] },
    { key: 'hemogram', title: '血象', items: ['Hb', 'WBC', 'PLT'] },
    { key: 'vitals', title: '体征', items: ['体重'] }
  ],
  /* 临床数据库 tab 与裁剪声明同口径：本台裁剪试验线，快照 0 条 */
  snapshotMeta: { count: 0, date: null },
  profiles: [
    {
      id: 'demo-a',
      name: '示例档案 A',
      tag: '刚确诊 · 记录少 · 多处未知',
      isDemo: true,
      profile: {
        确诊经过: '2026-10 左小腿出现大片瘀斑，无外伤史；化验 APTT 明显延长，医生考虑获得性血友病（原文照录）',
        进一步检查: 'APTT 纠正试验不能纠正（报告原文）；狼疮抗凝物阴性（报告原文）；抑制物滴度已送检（结果见化验记录）',
        病因与基础疾病筛查: '医生说需要排查自身免疫病、恶性肿瘤等基础疾病（具体安排待复诊确认）',
        就诊医院: '示例市第一医院血液内科',
        医生行动计划原话: '如果瘀斑突然增多、肿痛加重，或者尿色变红、解黑便，马上到急诊找我或值班医生；避免肌肉注射和剧烈活动。（王医生 2026-10-24 门诊原话照录）'
      },
      bleeds: [
        { id: 'a-b1', start: '2026-10-20', end: '2026-11-02', trigger: '未知', note: '左小腿大片瘀斑伴肿胀，住院观察（时间按出院小结整理）', private: false },
        { id: 'a-b2', start: '2026-11-08', end: null, trigger: '未知', note: '刷牙时牙龈渗血，量少；医生说先观察', private: false }
      ],
      labs: [
        { id: 'a-l1', metric: 'APTT', date: '2026-10-21', value: 78.6, unit: 's', method: '凝固法（硅土试剂）', org: '示例市第一医院', private: false },
        { id: 'a-l2', metric: 'FVIII', date: '2026-10-21', value: 3, unit: '%', method: '一期法', org: '示例市第一医院', private: false },
        { id: 'a-l3', metric: 'INH', date: '2026-10-23', value: 12.0, unit: 'BU/mL', method: 'Nijmegen 改良法', org: '示例市第一医院', private: false },
        { id: 'a-l4', metric: 'Hb', date: '2026-10-21', value: 96, unit: 'g/L', method: '血常规 五分类', org: '示例市第一医院', private: false },
        { id: 'a-l5', metric: 'WBC', date: '2026-09-30', value: 6.4, unit: '×10⁹/L', method: '血常规 五分类', org: '示例市第一医院', private: false },
        { id: 'a-l6', metric: 'PLT', date: '2026-10-21', value: 236, unit: '×10⁹/L', method: '血常规 五分类', org: '示例市第一医院', private: false },
        { id: 'a-l7', metric: 'Hb', date: '2026-11-06', value: 103, unit: 'g/L', method: '血常规 五分类', org: '示例市第一医院', private: false },
        { id: 'a-l8', metric: '体重', date: '2026-11-06', value: 66.0, unit: 'kg', method: '自录', org: '自录', private: false }
      ],
      treatments: [
        { id: 'a-t1', date: '2026-10-21', kind: '止血治疗', name: 'rFⅦa（血液科医嘱原文照录，剂量以医嘱单为准）', note: '医生交代：避免肌肉注射（原话照录）', private: false },
        { id: 'a-t2', date: '2026-10-24', kind: '复诊', name: '血液科首诊，安排抑制物滴度与病因筛查（原文照录）', note: '', private: false }
      ],
      meds: [
        { id: 'a-m1', name: '泼尼松（医生安排）', schedule: '每日（剂量以处方为准）', since: '2026-10-24', note: '合成示例：不写剂量；减量节点见治疗记录' }
      ],
      questions: [
        { id: 'a-q1', addedOn: '2026-11-10', q: '抑制物滴度多久复查一次？', answered: false, private: false },
        { id: 'a-q2', addedOn: '2026-11-10', q: '激素要吃多久、怎么减量？', answered: false, private: false }
      ],
      hospitals: [
        { id: 'a-h1', name: '示例市第一医院', dept: '血液内科', contact: '电话见挂号单（未录入）', ver: 1 }
      ],
      reports: [
        { id: 'a-r1', title: '凝血功能化验单（2026-10-21）', date: '2026-10-21', kind: '化验', source: '原件已登记', keydesc: '医生批注「APTT 延长，纠正试验不能纠正，考虑获得性血友病」（照录）', private: false },
        { id: 'a-r2', title: '抑制物滴度送检回执（2026-10-23）', date: '2026-10-23', kind: '化验', source: '未取得原件', keydesc: '', private: false },
        { id: 'a-r3', title: '（日期未知示例）外院凝血化验单', date: null, kind: '化验', source: '未核对', keydesc: '', private: false }
      ],
      docs: [
        { id: 'a-d1', name: '2026-10-24 门诊病历', date: '2026-10-24', type: '病历', state: '已登记' },
        { id: 'a-d2', name: '（日期未知示例）外院化验单', date: null, type: '化验', state: '待核对' }
      ],
      mind: {
        feel: [
          { d: '2026-11-09', text: '一看到新瘀斑就紧张，每天要检查好几遍小腿。', author: '本人', private: false },
          { d: '2026-11-10', text: '（私密记录示例）夜里牙龈渗血的时候有点害怕。', author: '本人', private: true }
        ],
        family: []
      }
    },
    {
      id: 'demo-b',
      name: '示例档案 B',
      tag: '多年随访 · 出血多次 · 记录多',
      isDemo: true,
      profile: {
        确诊经过: '2022-03 产后出血不止，化验 APTT 延长、Ⅷ因子活性极低，确诊获得性血友病 A（出院小结原文照录）',
        进一步检查: 'APTT 纠正试验不能纠正；狼疮抗凝物阴性；Ⅷ因子抑制物阳性（报告原文）',
        病因与基础疾病筛查: '2023 起按医生安排每年排查自身免疫病与恶性肿瘤（见复诊登记）',
        就诊医院: '示例市中心医院血液内科；2025 起跨院随诊',
        医生行动计划原话: '如果出现大片瘀斑、肌肉肿胀疼痛、血尿或黑便，当天联系我或到血液科急诊；复查前不要自行停激素。（刘医生 2025-12-18 门诊原话照录）'
      },
      bleeds: [
        { id: 'b-b1', start: '2022-03-05', end: '2022-04-18', trigger: '产后', note: '产后首次确诊住院（时间按出院小结整理）', private: false },
        { id: 'b-b2', start: '2023-01-12', end: '2023-02-03', trigger: '未知', note: '左前臂血肿，止血治疗后好转', private: false },
        { id: 'b-b3', start: '2024-05-20', end: '2024-06-02', trigger: '拔牙后', note: '拔牙后渗血不止，口腔科与血液科联合处理', private: false },
        { id: 'b-b4', start: '2025-12-05', end: '2026-01-15', trigger: '未知', note: '右大腿血肿住院，止血治疗后好转（见治疗登记）', private: false },
        { id: 'b-b5', start: '2026-08-14', end: '2026-08-20', trigger: '未知', note: '大片皮肤瘀斑，未住院', private: false },
        { id: 'b-b6', start: '2026-11-06', end: null, trigger: '未知', note: '刷牙出血增多，进行中', private: false },
        { id: 'b-b7', start: '2026-06-10', end: '2026-06-11', trigger: '（私密示例）跌倒后', note: '膝部瘀斑，未就医，仅自己记', private: true }
      ],
      labs: [
        { id: 'b-l01', metric: 'APTT', date: '2022-03-05', value: 92.4, unit: 's', method: '凝固法（硅土试剂）', org: '示例市中心医院', private: false },
        { id: 'b-l02', metric: 'FVIII', date: '2022-03-05', value: 2, unit: '%', method: '一期法', org: '示例市中心医院', private: false },
        { id: 'b-l03', metric: 'INH', date: '2022-03-06', value: 45.0, unit: 'BU/mL', method: 'Bethesda 法', org: '示例市中心医院', private: false },
        { id: 'b-l04', metric: 'Hb', date: '2022-03-05', value: 71, unit: 'g/L', method: '血常规 五分类', org: '示例市中心医院', private: false },
        { id: 'b-l05', metric: 'APTT', date: '2022-04-15', value: 46.2, unit: 's', method: '凝固法（硅土试剂）', org: '示例市中心医院', private: false },
        { id: 'b-l06', metric: 'FVIII', date: '2022-04-15', value: 38, unit: '%', method: '一期法', org: '示例市中心医院', private: false },
        { id: 'b-l07', metric: 'INH', date: '2022-04-15', value: 8.0, unit: 'BU/mL', method: 'Bethesda 法', org: '示例市中心医院', private: false },
        { id: 'b-l08', metric: 'Hb', date: '2022-04-15', value: 98, unit: 'g/L', method: '血常规 五分类', org: '示例市中心医院', private: false },
        { id: 'b-l09', metric: 'FVIII', date: '2022-06-20', value: 72, unit: '%', method: '一期法', org: '示例市中心医院', private: false },
        { id: 'b-l10', metric: 'INH', date: '2022-06-20', value: 0.4, unit: 'BU/mL', method: 'Bethesda 法', org: '示例市中心医院', private: false },
        { id: 'b-l11', metric: 'APTT', date: '2023-01-13', value: 66.8, unit: 's', method: '凝固法（硅土试剂）', org: '示例市中心医院', private: false },
        { id: 'b-l12', metric: 'FVIII', date: '2023-01-13', value: 6, unit: '%', method: '一期法', org: '示例市中心医院', private: false },
        { id: 'b-l13', metric: 'INH', date: '2023-01-13', value: 14.0, unit: 'BU/mL', method: 'Bethesda 法', org: '示例市中心医院', private: false },
        { id: 'b-l14', metric: 'Hb', date: '2023-01-13', value: 88, unit: 'g/L', method: '血常规 五分类', org: '示例市中心医院', private: false },
        { id: 'b-l15', metric: 'FVIII', date: '2023-02-28', value: 55, unit: '%', method: '一期法', org: '示例市中心医院', private: false },
        { id: 'b-l16', metric: 'INH', date: '2023-02-28', value: 0.8, unit: 'BU/mL', method: 'Bethesda 法', org: '示例市中心医院', private: false },
        { id: 'b-l17', metric: 'APTT', date: '2024-05-21', value: 58.3, unit: 's', method: '凝固法（白陶土试剂）', org: '示例市第二医院', private: false },
        { id: 'b-l18', metric: 'FVIII', date: '2024-05-21', value: 9, unit: '%', method: '一期法', org: '示例市第二医院', private: false },
        { id: 'b-l19', metric: 'INH', date: '2024-05-21', value: 6.5, unit: 'BU/mL', method: 'Nijmegen 改良法', org: '示例市第二医院', private: false },
        { id: 'b-l20', metric: 'INH', date: '2024-06-10', value: 0.5, unit: 'BU/mL', method: 'Nijmegen 改良法', org: '示例市第二医院', private: false },
        { id: 'b-l21', metric: 'FVIII', date: '2024-06-10', value: 61, unit: '%', method: '一期法', org: '示例市第二医院', private: false },
        { id: 'b-l22', metric: 'APTT', date: '2025-12-06', value: 74.1, unit: 's', method: '凝固法（硅土试剂）', org: '示例市中心医院', private: false },
        { id: 'b-l23', metric: 'FVIII', date: '2025-12-06', value: 4, unit: '%', method: '一期法', org: '示例市中心医院', private: false },
        { id: 'b-l24', metric: 'INH', date: '2025-12-06', value: 18.0, unit: 'BU/mL', method: 'Bethesda 法', org: '示例市中心医院', private: false },
        { id: 'b-l25', metric: 'Hb', date: '2025-12-06', value: 79, unit: 'g/L', method: '血常规 五分类', org: '示例市中心医院', private: false },
        { id: 'b-l26', metric: 'PLT', date: '2025-12-06', value: 228, unit: '×10⁹/L', method: '血常规 五分类', org: '示例市中心医院', private: false },
        { id: 'b-l27', metric: 'APTT', date: '2026-01-20', value: 41.5, unit: 's', method: '凝固法（硅土试剂）', org: '示例市中心医院', private: false },
        { id: 'b-l28', metric: 'FVIII', date: '2026-01-20', value: 46, unit: '%', method: '一期法', org: '示例市中心医院', private: false },
        { id: 'b-l29', metric: 'INH', date: '2026-01-20', value: 1.2, unit: 'BU/mL', method: 'Bethesda 法', org: '示例市中心医院', private: false },
        { id: 'b-l30', metric: 'FVIII', date: '2026-03-05', value: 68, unit: '%', method: '一期法', org: '示例市中心医院', private: false },
        { id: 'b-l31', metric: 'INH', date: '2026-03-05', value: 0.3, unit: 'BU/mL', method: 'Bethesda 法', org: '示例市中心医院', private: false },
        { id: 'b-l32', metric: 'APTT', date: '2026-08-15', value: 47.9, unit: 's', method: '凝固法（硅土试剂）', org: '示例市中心医院', private: false },
        { id: 'b-l33', metric: 'FVIII', date: '2026-08-15', value: 33, unit: '%', method: '一期法', org: '示例市中心医院', private: false },
        { id: 'b-l34', metric: 'Hb', date: '2026-08-15', value: 101, unit: 'g/L', method: '血常规 五分类', org: '示例市中心医院', private: false },
        { id: 'b-l35', metric: 'APTT', date: '2026-11-07', value: 52.6, unit: 's', method: '凝固法（硅土试剂）', org: '示例市中心医院', private: false },
        { id: 'b-l36', metric: 'FVIII', date: '2026-11-07', value: 21, unit: '%', method: '一期法', org: '示例市中心医院', private: false },
        { id: 'b-l37', metric: 'INH', date: '2026-11-07', value: 2.8, unit: 'BU/mL', method: 'Bethesda 法', org: '示例市中心医院', private: false },
        { id: 'b-l38', metric: 'Hb', date: '2026-11-07', value: 96, unit: 'g/L', method: '血常规 五分类', org: '示例市中心医院', private: false },
        { id: 'b-l39', metric: 'WBC', date: '2026-11-07', value: 7.4, unit: '×10⁹/L', method: '血常规 五分类', org: '示例市中心医院', private: false },
        { id: 'b-l40', metric: 'PLT', date: '2026-11-07', value: 241, unit: '×10⁹/L', method: '血常规 五分类', org: '示例市中心医院', private: false },
        { id: 'b-l41', metric: '体重', date: '2026-11-07', value: 57.5, unit: 'kg', method: '自录', org: '自录', private: false },
        { id: 'b-l42', metric: 'Hb', date: '2026-06-11', value: 102, unit: 'g/L', method: '自述外院', org: '外院（未核对）', private: true }
      ],
      treatments: [
        { id: 'b-t01', date: '2022-03-08', kind: '止血治疗', name: 'PCC（医嘱原文照录，剂量以医嘱单为准）', note: '医生交代：卧床期间按医嘱活动，注意血栓相关症状观察（原话照录）', private: false },
        { id: 'b-t02', date: '2022-04-02', kind: '免疫抑制治疗', name: '泼尼松联合利妥昔单抗（医嘱原文照录；利妥昔单抗为单剂量）', note: '预防感染相关安排按医嘱（原话照录）', private: false },
        { id: 'b-t03', date: '2023-01-15', kind: '调药', name: '激素调整并逐步减量（门诊原话照录）', note: '', private: false },
        { id: 'b-t04', date: '2024-05-22', kind: '复诊', name: '拔牙后血液科随访（原文照录）', note: '', private: false },
        { id: 'b-t05', date: '2025-12-08', kind: '止血治疗', name: 'rFⅦa（医嘱原文照录，剂量以医嘱单为准）', note: '医生门诊原话：单一药物效果不佳时换用或交替（照录）', private: false },
        { id: 'b-t06', date: '2025-12-10', kind: '免疫抑制治疗', name: '泼尼松联合环磷酰胺（医嘱原文照录；医生按当时情况选择）', note: '血常规与感染症状监测按医嘱（原话照录）', private: false },
        { id: 'b-t07', date: '2026-03-05', kind: '复诊', name: '年度复查：病因筛查+凝血全套（原文照录）', note: '', private: false }
      ],
      meds: [
        { id: 'b-m1', name: '泼尼松（减量中，医生安排）', schedule: '每日（剂量变化见治疗登记）', since: '2022-04-02', note: '合成示例：不写剂量；更正=新增版本' }
      ],
      questions: [
        { id: 'b-q1', addedOn: '2026-11-09', q: '这次抑制物滴度复测什么时候安排？', answered: false, private: false },
        { id: 'b-q2', addedOn: '2026-11-02', q: '激素减到什么时候可以停？', answered: false, private: false },
        { id: 'b-q3', addedOn: '2026-10-30', q: '（私密示例）这次出血会不会拖很久？', answered: false, private: true }
      ],
      hospitals: [
        { id: 'b-h1', name: '示例市中心医院', dept: '血液内科', contact: '电话见出院小结', ver: 2 },
        { id: 'b-h2', name: '示例市第二医院', dept: '血液科门诊', contact: '出处引用：2024-05-21 化验单抬头', ver: 1 }
      ],
      reports: [
        { id: 'b-r1', title: '出院小结（2022-04-18）', date: '2022-04-18', kind: '病历', source: '原件已登记', keydesc: '「出院诊断：获得性血友病A；Ⅷ因子抑制物阳性」（医生报告原文）', private: false },
        { id: 'b-r2', title: '抑制物滴度化验单（2026-11-07）', date: '2026-11-07', kind: '化验', source: '原件已登记', keydesc: '', private: false },
        { id: 'b-r3', title: '年度复查报告（2026-03-05）', date: '2026-03-05', kind: '化验', source: '未取得原件', keydesc: '', private: false },
        { id: 'b-r4', title: '（私密示例）外院化验单（2026-06-11）', date: '2026-06-11', kind: '化验', source: '未核对', keydesc: '', private: true }
      ],
      docs: [
        { id: 'b-d1', name: '2022-04-18 出院小结', date: '2022-04-18', type: '病历', state: '已登记' },
        { id: 'b-d2', name: '2026-03-05 复查报告', date: '2026-03-05', type: '化验', state: '已登记' },
        { id: 'b-d3', name: '（日期未知示例）旧凝血化验单', date: null, type: '化验', state: '待核对' }
      ],
      mind: {
        feel: [
          { d: '2026-11-08', text: '这次又出血了，心里咯噔一下；好在这次知道该先联系谁。', author: '本人', private: false },
          { d: '2026-08-16', text: '大片瘀斑消得很慢，出门都想穿长裤遮一下。', author: '本人', private: false },
          { d: '2026-11-09', text: '（私密记录示例）最怕的是夜里出血没人发现。', author: '本人', private: true }
        ],
        family: [
          { d: '2026-11-08', text: '女儿把「复诊记得带激素药盒」写在了冰箱贴上。', author: '家属', private: false },
          { d: '2025-12-20', text: '爱人学会了医生交代的观察要点，值班时会帮我盯一眼。', author: '家属', private: false }
        ]
      }
    }
  ]
}
