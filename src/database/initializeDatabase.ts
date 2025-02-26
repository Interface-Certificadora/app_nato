import { type SQLiteDatabase } from "expo-sqlite";
export async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      CPF TEXT,
      isDoc BOOLEAN NOT NULL DEFAULT 0,
      typeDoc TEXT,
      doc TEXT,
      biometria TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );`);
}
