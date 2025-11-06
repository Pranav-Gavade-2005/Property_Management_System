import bcrypt from 'bcrypt';
import { getUserByEmail, getUserById } from '../models/userModel.js';

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const user = await getUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  req.session.user = { id: user.id, role: user.role, name: user.name, email: user.email };
  res.json({ user: req.session.user });
}

export function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
}

export async function me(req, res) {
  if (!req.session?.user) return res.status(401).json({ error: 'Unauthorized' });
  const user = await getUserById(req.session.user.id);
  res.json({ user: { id: user.id, role: user.role, name: user.name, email: user.email } });
}
