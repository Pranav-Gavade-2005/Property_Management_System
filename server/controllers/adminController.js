import bcrypt from 'bcrypt';
import { createUser, deleteUser, getAllUsers } from '../models/userModel.js';

export async function listUsers(req, res) {
  const users = await getAllUsers();
  res.json({ users });
}

export async function createUserCtrl(req, res) {
  const { name, email, password, role, phone } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ error: 'Missing fields' });
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await createUser({ name, email, password: hash, role, phone });
    res.status(201).json({ user });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    throw e;
  }
}

export async function deleteUserCtrl(req, res) {
  const { id } = req.params;
  await deleteUser(id);
  res.json({ ok: true });
}
