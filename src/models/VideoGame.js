import dbModule, { saveDatabase } from '../config/database.js';

class VideoGame {
  static tableName = 'video_games';

  static get db() {
    return dbModule.db;
  }

  static createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        genre TEXT,
        platform TEXT,
        releaseYear INTEGER,
        rating REAL,
        price REAL,
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

  static create({ title, genre, platform, releaseYear, rating, price }) {
    const stmt = this.db.prepare(
      `INSERT INTO ${this.tableName} (title, genre, platform, releaseYear, rating, price)
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    stmt.bind([
      title,
      genre || null,
      platform || null,
      releaseYear || null,
      rating || null,
      price || null
    ]);
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

  static update(id, { title, genre, platform, releaseYear, rating, price }) {
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (genre !== undefined) {
      updates.push('genre = ?');
      values.push(genre);
    }
    if (platform !== undefined) {
      updates.push('platform = ?');
      values.push(platform);
    }
    if (releaseYear !== undefined) {
      updates.push('releaseYear = ?');
      values.push(releaseYear);
    }
    if (rating !== undefined) {
      updates.push('rating = ?');
      values.push(rating);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      values.push(price);
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
    console.log('Seeding video_games table...');
    [
      { title: 'The Legend of Zelda: Breath of the Wild', genre: 'Action-Adventure', platform: 'Nintendo Switch', releaseYear: 2017, rating: 9.7, price: 59.99 },
      { title: 'God of War', genre: 'Action-Adventure', platform: 'PlayStation 4', releaseYear: 2018, rating: 9.5, price: 49.99 },
      { title: 'Hades', genre: 'Roguelike', platform: 'PC', releaseYear: 2020, rating: 9.3, price: 24.99 },
      { title: 'Elden Ring', genre: 'Action RPG', platform: 'Multi-platform', releaseYear: 2022, rating: 9.6, price: 59.99 }
    ].forEach(g => this.create(g));
    console.log('Seed complete');
  }
}

export default VideoGame;
