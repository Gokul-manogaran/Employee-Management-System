const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config({ path: '../config.env' });

const dbPath = process.env.DB_PATH || './database.sqlite';
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Users table for authentication
            db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'employee',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

            // Employees table
            db.run(`
        CREATE TABLE IF NOT EXISTS employees (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          age INTEGER NOT NULL,
          class TEXT,
          subjects TEXT,
          attendance REAL DEFAULT 0,
          user_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

            // Insert default admin user
            const bcrypt = require('bcryptjs');
            const { v4: uuidv4 } = require('uuid');

            const adminId = uuidv4();
            const hashedPassword = bcrypt.hashSync('admin123', 10);

            db.run(`
        INSERT OR IGNORE INTO users (id, username, email, password, role)
        VALUES (?, ?, ?, ?, ?)
      `, [adminId, 'admin', 'admin@company.com', hashedPassword, 'admin']);

            // Insert sample employees
            const sampleEmployees = [
                {
                    id: uuidv4(),
                    name: 'John Doe',
                    age: 30,
                    class: 'Senior Developer',
                    subjects: 'JavaScript,React,Node.js',
                    attendance: 95.5,
                    user_id: uuidv4()
                },
                {
                    id: uuidv4(),
                    name: 'Jane Smith',
                    age: 28,
                    class: 'UI/UX Designer',
                    subjects: 'Figma,Sketch,Adobe XD',
                    attendance: 92.0,
                    user_id: uuidv4()
                },
                {
                    id: uuidv4(),
                    name: 'Mike Johnson',
                    age: 35,
                    class: 'Project Manager',
                    subjects: 'Agile,Scrum,Leadership',
                    attendance: 88.5,
                    user_id: uuidv4()
                }
            ];

            sampleEmployees.forEach(emp => {
                db.run(`
          INSERT OR IGNORE INTO employees (id, name, age, class, subjects, attendance, user_id)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [emp.id, emp.name, emp.age, emp.class, emp.subjects, emp.attendance, emp.user_id]);
            });

            resolve();
        });
    });
};

module.exports = { db, initializeDatabase }; 