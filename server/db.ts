import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "users.db");
const db = new Database(dbPath);

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    email TEXT UNIQUE,
    phoneNumber TEXT UNIQUE,
    password TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export const dbUserOperations = {
  // Create user
  create: (fullName: string, email: string | null, phoneNumber: string | null, password: string) => {
    try {
      const stmt = db.prepare(
        "INSERT INTO users (fullName, email, phoneNumber, password) VALUES (?, ?, ?, ?)"
      );
      stmt.run(fullName, email, phoneNumber, password);
      return { success: true };
    } catch (error: any) {
      if (error.message.includes("UNIQUE")) {
        return { success: false, error: "Email or phone already registered" };
      }
      return { success: false, error: error.message };
    }
  },

  // Find by email
  findByEmail: (email: string) => {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    return stmt.get(email);
  },

  // Find by phone
  findByPhone: (phoneNumber: string) => {
    const stmt = db.prepare("SELECT * FROM users WHERE phoneNumber = ?");
    return stmt.get(phoneNumber);
  },

  // Get all users (for debugging)
  getAllUsers: () => {
    const stmt = db.prepare("SELECT fullName, email, phoneNumber, createdAt FROM users");
    return stmt.all();
  },
};

export default db;
