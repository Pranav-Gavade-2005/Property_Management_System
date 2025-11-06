import { Router } from 'express';
import { tenantProperty, updateProfile } from '../controllers/tenantController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireRole('tenant'));

router.get('/property', tenantProperty);
router.put('/profile', updateProfile);

export default router;
