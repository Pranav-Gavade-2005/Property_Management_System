import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import propertyRoutes from './routes/properties.js';
import tenantRoutes from './routes/tenant.js';
import propertyApplicationRoutes from './routes/propertyApplications.js';
import maintenanceRoutes from './routes/maintenance.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());

const PgSession = connectPgSimple(session);
const pgPool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.use(
  session({
    store: new PgSession({
      pool: pgPool,
      tableName: 'session',
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || 'changeme',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);

app.get('/', (req, res) => {
  res.json({ ok: true });
});

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/properties', propertyRoutes);
app.use('/tenant', tenantRoutes);
app.use('/property-applications', propertyApplicationRoutes);
app.use('/maintenance', maintenanceRoutes);
app.use('/upload', uploadRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
