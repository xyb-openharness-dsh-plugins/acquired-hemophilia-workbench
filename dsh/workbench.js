/**
 * 领域服务：把"数据根 → 开库 → 播种 → 读模型"收在一个可测对象里。
 *
 * 为什么单独一层：`dsh/index.js` 要 import Schemastery（宿主提供的 peer，本仓装不上），
 * 那一行会让整个入口不可单测。把可测逻辑放这里，入口只留 wiring。
 */
import { join, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const HERE = dirname(fileURLToPath(import.meta.url));
import { openStore, closeStore, migrate } from './store.js';
import { seedDemoData, hasDemoData } from './demo.js';
import { readBootstrap } from './readmodels.js';
import { DB_FILE, HOME_DIR } from '../lib/identity.js';
import { version, displayVersion, build as buildDate } from '../lib/version.js';

export class Workbench {
  /**
   * @param {object} options
   * @param {string} options.root      用户资料目录（必须由用户明确指定；调用方负责校验）
   * @param {boolean} [options.seedDemo] 首次打开是否写入演示数据（默认 true，仅空库生效）
   */
  constructor({ root, seedDemo = true } = {}) {
    if (typeof root !== 'string' || root.trim() === '') throw new Error('Workbench 需要 root（用户资料目录）');
    this.root = root;
    this.dbFile = join(root, DB_FILE);
    this.db = null;
    this.seedDemo = seedDemo;
  }

  /** 打开（幂等）。迁移与播种都在这里完成。 */
  open() {
    if (this.db) return this;
    this.db = openStore(this.dbFile);
    this.migrations = migrate(this.db);
    /* 用户上次在面板里选过的资料目录优先于 cordis 默认值（目录还在才生效）。
       少了这一步，「配置目录」选完重开 Desktop 又回到默认位置，等于没选。 */
    if (!this._rootApplied) {
      this._rootApplied = true;
      try {
        const row = this.db.prepare("SELECT value FROM app_setting WHERE key='data_root'").get();
        if (row?.value && row.value !== this.root && existsSync(row.value)) {
          closeStore(this.db);
          this.root = row.value;
          this.dbFile = join(this.root, DB_FILE);
          this.db = openStore(this.dbFile);
          this.migrations = migrate(this.db);
        }
      } catch { /* 旧库没有 app_setting 表也不该拦住打开 */ }
    }
    this.seeded = this.seedDemo ? seedDemoData(this.db) : { skipped: true, profiles: 0 };
    return this;
  }

  get dataRoot() { return this.root }

  /** 切换资料目录：先开新库成功再替换，失败回滚到原库（不能把用户的数据根弄丢）。 */
  setDataRoot(nextRoot) {
    this.open();
    const dir = String(nextRoot || '').trim();
    if (!dir || dir === this.root) return this.root;
    const prevRoot = this.root;
    const prevFile = this.dbFile;
    closeStore(this.db);
    this.db = null;
    try {
      this.dbFile = join(dir, DB_FILE);
      this.db = openStore(this.dbFile);
      this.migrations = migrate(this.db);
      this.root = dir;
      this.db.prepare("INSERT INTO app_setting(key,value,updated_at) VALUES('data_root',?,datetime('now')) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at").run(dir);
      this.seeded = this.seedDemo ? seedDemoData(this.db) : { skipped: true, profiles: 0 };
      return this.root;
    } catch (error) {
      this.root = prevRoot;
      this.dbFile = prevFile;
      try { this.db = openStore(this.dbFile); } catch { this.db = null; }
      throw error;
    }
  }

  close() {
    if (this.db) { closeStore(this.db); this.db = null; }
  }

  get stats() {
    if (!this.db) return null;
    const subjects = this.db.prepare('SELECT COUNT(*) c FROM subjects').get().c;
    const labs = this.db.prepare('SELECT COUNT(*) c FROM lab_results').get().c;
    const bleeds = this.db.prepare('SELECT COUNT(*) c FROM bleed_events').get().c;
    const metrics = this.db.prepare('SELECT COUNT(*) c FROM metric_defs').get().c;
    return { profiles: subjects, metrics, labs, bleeds, hasDemo: subjects > 0 };
  }

  bootstrap() {
    this.open();
    return readBootstrap(this.db);
  }

  profile(profileId) {
    this.open();
    return readBootstrap(this.db, profileId);
  }

  /* ---------------- 写入 API（0.3.0：demo + 新建共存，多用户，写通 sqlite） ---------------- */

  /* kind → 表与读模型 id 字符映射（与 readmodels.synthId 同一套，id 才能对回 rowid） */
  static KINDS = {
    bleed: { table: 'bleed_events', idChar: 'b' },
    lab: { table: 'lab_results', idChar: 'l' },
    treatment: { table: 'treatment_events', idChar: 't' },
    question: { table: 'visit_questions', idChar: 'q' },
    hospital: { table: 'hospitals', idChar: 'h' },
    report: { table: 'reports', idChar: 'r' },
    doc: { table: 'documents', idChar: 'd' },
    mind: { table: 'mind_notes', idChar: 'f' },
  }

  #padFor(profileKey, kind) {
    /* 与 readmodels.idPad 同一规则：demo-b 的 labs/treatments 是两位手写 id，其余一位 */
    return (profileKey === 'demo-b' && (kind === 'lab' || kind === 'treatment')) ? 2 : 1
  }

  #prefix(profileKey) { return String(profileKey || '').replace(/^demo-/, '') }

  /** 按 readmodels 同序取该档案该 kind 的行（ORDER BY rowid），返回 [rowid, syntheticId]。 */
  #rowsFor(profileKey, kind) {
    const def = Workbench.KINDS[kind]
    if (!def) throw new Error('未知记录类型：' + kind)
    const pad = this.#padFor(profileKey, kind)
    let where = 'profile_key = ?'
    const args = [profileKey]
    if (kind === 'mind') where += " AND kind IN ('feel','family')"
    const rows = this.db.prepare(`SELECT rowid AS rid FROM ${def.table} WHERE ${where} ORDER BY rowid`).all(...args)
    return { def, rows: rows.map((r, i) => ({ rid: r.rid, sid: `${this.#prefix(profileKey)}-${def.idChar}${String(i + 1).padStart(pad, '0')}` })) }
  }

  #today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  /** 新建档案（真实用户数据；与演示档案同表共存，is_demo=0）。 */
  createProfile({ name, tag, facts = {} } = {}) {
    this.open();
    if (!name || !String(name).trim()) throw new Error('档案名称为必填项');
    const key = 'user-' + Date.now().toString(36);
    this.db.prepare('INSERT INTO subjects (profile_key, name, meta, headline, action_plan, dash_keys, created_on, is_demo) VALUES (?,?,?,?,?,?,?,0)')
      .run(key, String(name).trim().slice(0, 24), tag ? String(tag).slice(0, 40) : null, null, facts['医生行动计划原话'] ?? null, null, this.#today());
    const factIns = this.db.prepare('INSERT INTO profile_facts (profile_key, fact_key, fact_value, fact_date, ver) VALUES (?,?,?,?,1)');
    for (const [k, v] of Object.entries(facts)) {
      if (k === '医生行动计划原话') continue;
      if (v == null || String(v).trim() === '') continue;
      factIns.run(key, k, String(v), null);
    }
    return { profileKey: key, name: String(name).trim().slice(0, 24) };
  }

  /** 新增一条记录（写通 sqlite；返回与读模型同形的行，含合成 id）。 */
  addEntry(profileKey, kind, data = {}) {
    this.open();
    const def = Workbench.KINDS[kind];
    if (!def) throw new Error('未知记录类型：' + kind);
    const exists = this.db.prepare('SELECT COUNT(*) c FROM subjects WHERE profile_key = ?').get(profileKey).c;
    if (!exists) throw new Error('档案不存在：' + profileKey);
    const priv = data.private ? 1 : 0;
    const now = this.#today();
    let info;
    if (kind === 'bleed') {
      if (!data.start) throw new Error('开始日期为必填项');
      info = this.db.prepare('INSERT INTO bleed_events (profile_key, start_date, end_date, trigger_text, note, is_private, ver) VALUES (?,?,?,?,?,?,1)')
        .run(profileKey, data.start, data.end || null, data.trigger || '', data.note || '', priv);
    } else if (kind === 'lab') {
      if (!data.date || data.value == null || data.value === '') throw new Error('日期与结果为必填项');
      /* 展示键（APTT）→ 库键（aptt）：metric_defs.key=库键、title=展示键 */
      const def2 = this.db.prepare('SELECT key FROM metric_defs WHERE title = ?').get(data.metric);
      info = this.db.prepare('INSERT INTO lab_results (profile_key, metric_key, measured_on, value, unit, method, org, is_private, note, ver) VALUES (?,?,?,?,?,?,?,?,?,1)')
        .run(profileKey, def2 ? def2.key : String(data.metric || '').toLowerCase(), data.date, data.value, data.unit || '', data.method || '', data.org || '', priv, null);
    } else if (kind === 'treatment') {
      if (!data.date || !data.name) throw new Error('日期与内容为必填项');
      info = this.db.prepare('INSERT INTO treatment_events (profile_key, event_date, kind, name, note, is_private, ver) VALUES (?,?,?,?,?,?,1)')
        .run(profileKey, data.date, data.kind || '按次', data.name, data.note || '', priv);
    } else if (kind === 'question') {
      if (!data.q) throw new Error('问题内容为必填');
      info = this.db.prepare('INSERT INTO visit_questions (profile_key, question, added_on, answered_on, is_private, ver) VALUES (?,?,?,NULL,?,1)')
        .run(profileKey, data.q, now, priv);
    } else if (kind === 'hospital') {
      if (!data.name) throw new Error('医院名称为必填');
      info = this.db.prepare('INSERT INTO hospitals (profile_key, name, dept, contact, ver) VALUES (?,?,?,?,1)')
        .run(profileKey, data.name, data.dept || '', data.contact || '未录入');
    } else if (kind === 'report') {
      if (!data.title) throw new Error('报告名称为必填');
      info = this.db.prepare('INSERT INTO reports (profile_key, title, kind, reported_on, source_state, key_finding, is_private, ver) VALUES (?,?,?,?,?,?,?,1)')
        .run(profileKey, data.title, data.kind || '其他', data.date || null, data.source || '未取得原件', data.keydesc || '', priv);
    } else if (kind === 'doc') {
      info = this.db.prepare('INSERT INTO documents (profile_key, name, doc_type, doc_date, state, is_private) VALUES (?,?,?,?,?,0)')
        .run(profileKey, data.name || '未命名资料', data.type || '其他', data.date || null, data.state || '待核对');
    } else if (kind === 'mind') {
      if (!data.text) throw new Error('内容为必填');
      info = this.db.prepare('INSERT INTO mind_notes (profile_key, kind, noted_on, body, author, is_private, ver) VALUES (?,?,?,?,?,?,1)')
        .run(profileKey, data.mindKind === 'family' ? 'family' : 'feel', data.d || now, data.text, data.author || (data.mindKind === 'family' ? '家属' : '本人'), priv);
    } else {
      throw new Error('未知记录类型：' + kind);
    }
    const rid = Number(info.lastInsertRowid);
    const { rows } = this.#rowsFor(profileKey, kind);
    const hit = rows.find((r) => r.rid === rid);
    return { ok: true, kind, profileKey, rowid: rid, id: hit ? hit.sid : null };
  }

  /** 私密切换（更正不改写历史：is_private 是行属性，历史版本各自带标记）。 */
  setPrivacy(profileKey, kind, idOrIndex, isPrivate) {
    this.open();
    const def = Workbench.KINDS[kind];
    if (!def) throw new Error('未知记录类型：' + kind);
    let target = null;
    if (kind === 'mind') {
      const sub = String(idOrIndex).startsWith('family') ? 'family' : 'feel';
      const idx = Number(String(idOrIndex).replace(/^(feel|family)/, '')) || 0;
      const rows = this.db.prepare("SELECT rowid AS rid FROM mind_notes WHERE profile_key = ? AND kind = ? ORDER BY rowid").all(profileKey, sub);
      target = rows[idx]?.rid ?? null;
    } else {
      const { rows } = this.#rowsFor(profileKey, kind);
      target = rows.find((r) => r.sid === idOrIndex)?.rid ?? null;
    }
    if (target == null) throw new Error('找不到要改隐私标记的记录：' + kind + ' ' + idOrIndex);
    this.db.prepare(`UPDATE ${def.table} SET is_private = ? WHERE rowid = ?`).run(isPrivate ? 1 : 0, target);
    return { ok: true, kind, profileKey, id: idOrIndex, private: Boolean(isPrivate) };
  }

  /** 列出全部档案（含新建的，is_demo 标记随行）。 */
  listProfiles() {
    this.open();
    return this.db.prepare('SELECT profile_key, name, meta, is_demo, created_on FROM subjects ORDER BY rowid').all();
  }

  /** 供宿主 /health 用：只报事实，不报"是否已验证" */
  status() {
    return {
      version, displayVersion, buildDate,
      homeDir: HOME_DIR,
      dbFile: DB_FILE,
      root: this.root,
      capabilities: ['bootstrap', 'profile', 'health', 'write'],
      stats: this.stats,
      seeded: this.seeded ?? null,
      migrations: this.migrations ?? null,
    };
  }

  /** 演示数据重载（幂等；force 才清空重播，仅供开发用） */
  reloadDemo(force = false) {
    this.open();
    return seedDemoData(this.db, { force });
  }

  get hasData() {
    this.open();
    return hasDemoData(this.db);
  }

  /**
   * 临床试验检索（M4 research 快照，登记状态未核实；无匹配指数、无判读列）。
   * keyword 大小写不敏感 LIKE；未取得快照时返回 honest 空态（不写零结果）。
   */
  trialMatch(keyword) {
    /* 双形态查找：包内（宿主装机，research 随包发出）→ root 旁路（dev 布局）；都没有如实返回不可用 */
    const candidates = [
      join(HERE, '..', 'research', 'acquired-hemophilia', 'acquired_hemophilia_trials_2026.sqlite'),
      join(this.root, '..', 'research', 'acquired-hemophilia', 'acquired_hemophilia_trials_2026.sqlite'),
    ];
    let dbPath = null;
    for (const c of candidates) if (existsSync(c)) { dbPath = c; break; }
    if (!dbPath) {
      return { available: false, reason: 'research/acquired-hemophilia 快照不可用（M4 快照未采集或未随包发出）', records: [] };
    }
    const rdb = new DatabaseSync(dbPath, { readOnly: true });
    const kw = String(keyword || '').trim();
    const rows = kw
      ? rdb.prepare('SELECT * FROM trials WHERE title LIKE ? ORDER BY rowid LIMIT 50').all('%' + kw + '%')
      : rdb.prepare('SELECT * FROM trials ORDER BY rowid LIMIT 50').all();
    const totalAll = rdb.prepare('SELECT COUNT(*) AS n FROM trials').get().n
    const out = rows.map((r) => ({
      recordId: r.record_id, title: r.title, studyType: r.study_type,
      sponsors: r.sponsors ? JSON.parse(r.sponsors) : null,
      registryNumbers: r.registry_numbers ? JSON.parse(r.registry_numbers) : null,
      sourceUrl: r.source_url, statusNote: r.status_note, snapshotDate: r.snapshot_date,
    }));
    rdb.close();
    /* 诚实口径（35 号）：本通道只做关键词过滤与登记字段透传，不做符合度判读；
       条目无法结构化，需人工核对；登记状态未核实，快照会过期。 */
    return { available: true, snapshotDate: out[0]?.snapshotDate ?? null, total: totalAll, records: out,
      honestyNote: '条目无法结构化，需人工核对；登记状态未核实，快照会过期，以官方登记页为准' };
  }
}

export { readBootstrap, seedDemoData, openStore, closeStore };
