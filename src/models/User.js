import dbModule, { saveDatabase } from '../config/database.js';

class User {
  static tableName = 'users';

  static get db() {
    return dbModule.db;
  }

  static createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    this.db.exec(sql);
    console.log(`Table '${this.tableName}' created/verified`);
  }

  static findAll() {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName} ORDER BY id`);
    stmt.bind();
    const rows = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      rows.push(row);
    }
    stmt.free();
    return rows;
  }

  static findById(id) {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`);
    stmt.bind([id]);
    const row = stmt.step() ? stmt.getAsObject() : null;
    stmt.free();
    return row;
  }

  static findByEmail(email) {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE email = ?`);
    stmt.bind([email]);
    const row = stmt.step() ? stmt.getAsObject() : null;
    stmt.free();
    return row;
  }

  static emailExists(email, excludeId = null) {
    if (!email) return false;
    let stmt;
    if (excludeId) {
      stmt = this.db.prepare(`SELECT id FROM ${this.tableName} WHERE email = ? AND id != ?`);
      stmt.bind([email, excludeId]);
    } else {
      stmt = this.db.prepare(`SELECT id FROM ${this.tableName} WHERE email = ?`);
      stmt.bind([email]);
    }
    const exists = stmt.step();
    stmt.free();
    return exists;
  }

  static create({ name, email }) {
    const stmt = this.db.prepare(
      `INSERT INTO ${this.tableName} (name, email) VALUES (?, ?)`
    );
    stmt.bind([name, email || null]);
    stmt.step();
    stmt.free();

    const idStmt = this.db.prepare("SELECT last_insert_rowid() as id");
    idStmt.bind();
    idStmt.step();
    const lastId = idStmt.getAsObject().id;
    idStmt.free();

    saveDatabase();
    return this.findById(lastId);
  }

  static update(id, { name, email }) {
    const updates = [];
    const values = [];
    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    updates.push('updated_at = CURRENT_TIMESTAMP');

    if (updates.length === 1) {
      return this.findById(id);
    }
    values.push(id);
    const stmt = this.db.prepare(
      `UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = ?`
    );
    stmt.bind(values);
    stmt.step();
    stmt.free();
    saveDatabase();
    return this.findById(id);
  }

  static delete(id) {
    const stmt = this.db.prepare(
      `DELETE FROM ${this.tableName} WHERE id = ?`
    );
    stmt.bind([id]);
    stmt.step();
    stmt.free();

    const changesStmt = this.db.prepare("SELECT changes() as changes");
    changesStmt.bind();
    changesStmt.step();
    const changes = changesStmt.getAsObject().changes;
    changesStmt.free();
    saveDatabase();
    return changes > 0;
  }

  static count() {
    const stmt = this.db.prepare(
      `SELECT COUNT(*) AS count FROM ${this.tableName}`
    );
    stmt.bind();
    stmt.step();
    const count = stmt.getAsObject().count;
    stmt.free();
    return count;
  }

  static seed() {
    if (this.count() > 0) return;
    console.log('Seeding users table...');
    [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
      { name: 'Charlie', email: 'charlie@example.com' },
      { name: 'Dave', email: 'dave@example.com' }
    ].forEach(u => this.create(u));
    console.log('Seed complete');
  }
}

export default User;
