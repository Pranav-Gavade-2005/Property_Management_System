export function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.session?.user?.role === role) return next();
    return res.status(403).json({ error: 'Forbidden' });
  };
}

export function requireRoles(roles) {
  return (req, res, next) => {
    if (req.session?.user && roles.includes(req.session.user.role)) return next();
    return res.status(403).json({ error: 'Forbidden' });
  };
}
