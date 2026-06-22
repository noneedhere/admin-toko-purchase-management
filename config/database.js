const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || './database/admin_toko.db';
const dbDir = path.dirname(path.resolve(DB_PATH));

// Pastikan direktori database ada
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(path.resolve(DB_PATH));

// Aktifkan WAL mode untuk performa lebih baik
db.pragma('journal_mode = WAL');
// Aktifkan foreign keys
db.pragma('foreign_keys = ON');

// --- Inisialisasi Schema ---
const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schemaSql);

// --- Seed Data (hanya jika tabel products kosong) ---
const row = db.prepare('SELECT COUNT(*) AS count FROM products').get();
if (row.count === 0) {
  const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');
  const seedSql = fs.readFileSync(seedPath, 'utf-8');
  db.exec(seedSql);
  console.log('Database seeded dengan 10 produk dummy.');
}

console.log('Database terkoneksi:', path.resolve(DB_PATH));

module.exports = db;
