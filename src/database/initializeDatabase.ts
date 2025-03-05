import { type SQLiteDatabase } from "expo-sqlite";
export async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    DROP TABLE IF EXISTS users;
`);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      CPF TEXT,
      email TEXT,
      telefone TEXT,
      isDoc BOOLEAN NOT NULL DEFAULT 0,
      doc TEXT,
      biometria TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );`);
}
