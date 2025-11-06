import bcrypt from 'bcrypt';
import { getUserByEmail, getUserById, createUser } from '../models/userModel.js';

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

export async function register(req, res) {
  try {
    const { name, email, password, role, phone } = req.body;
    
    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }
    
    if (!['admin', 'owner', 'tenant'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin, owner, or tenant' });
    }
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || null
    });
    
    // Auto-login after registration
    req.session.user = { id: user.id, role: user.role, name: user.name, email: user.email };
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: req.session.user 
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
}

export async function me(req, res) {
  if (!req.session?.user) return res.status(401).json({ error: 'Unauthorized' });
  const user = await getUserById(req.session.user.id);
  res.json({ user: { id: user.id, role: user.role, name: user.name, email: user.email } });
}
