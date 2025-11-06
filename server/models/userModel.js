import pool from '../db.js';

export async function getUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  return rows[0];
}

export async function getUserById(id) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
  return rows[0];
}

export async function createUser({ name, email, password, role, phone }) {
  const { rows } = await pool.query(
    `INSERT INTO users(name, email, password, role, phone)
     VALUES($1,$2,$3,$4,$5) RETURNING id, name, email, role, phone`,
    [name, email, password, role, phone || null]
  );
  return rows[0];
}

export async function getAllUsers() {
  const { rows } = await pool.query('SELECT id, name, email, role, phone, assigned_property FROM users ORDER BY id ASC');
  return rows;
}

export async function deleteUser(id) {
  await pool.query('DELETE FROM users WHERE id=$1', [id]);
}

export async function updateUserProfile(id, { name, phone }) {
  const { rows } = await pool.query(
    'UPDATE users SET name=$1, phone=$2 WHERE id=$3 RETURNING id, name, email, role, phone, assigned_property',
    [name, phone, id]
  );
  return rows[0];
}

export async function setAssignedProperty(userId, propertyId) {
  await pool.query('UPDATE users SET assigned_property=$1 WHERE id=$2', [propertyId, userId]);
}
