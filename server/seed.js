import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import pool from './db.js';

dotenv.config();

async function run() {
  const name = process.env.ADMIN_NAME || 'Admin User';
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'admin12345';

  const { rows } = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
  if (rows.length) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO users(name, email, password, role) VALUES($1,$2,$3,$4)`,
    [name, email, hash, 'admin']
  );
  console.log('Admin created:', email);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
