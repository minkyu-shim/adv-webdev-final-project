import initSqlJs from 'sql.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.isAbsolute(config.databaseUrl)
  ? config.databaseUrl
  : path.join(__dirname, '../../', config.databaseUrl);

console.log(`Database path: ${dbPath}`);

let db;
let SQL;

// Initialize SQL.js and database
async function initDb() {
  if (!SQL) {
    SQL = await initSqlJs();
  }
  if (!db) {
    if (existsSync(dbPath)) {
      const buffer = readFileSync(dbPath);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }
  }
  return db;
}

// Save database to file
export const saveDatabase = () => {
  const data = db.export();
  const buffer = Buffer.from(data);
  writeFileSync(dbPath, buffer);
};

export const initializeDatabase = async () => {
  console.log('Initializing database...');
  await initDb();

  const User = (await import('../models/User.js')).default;
  const VideoGame = (await import('../models/VideoGame.js')).default;

  User.createTable();
  VideoGame.createTable();
  saveDatabase();
  if (config.isDevelopment()) {
    User.seed();
    VideoGame.seed();
    saveDatabase();
  }
  console.log('Database initialization complete');
};

// Export a getter function
export const getDatabase = () => db;

// For backward compatibility with existing imports
export default { get db() { return db; } };
