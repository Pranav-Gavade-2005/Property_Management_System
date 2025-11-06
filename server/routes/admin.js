import { Router } from 'express';
import { createUserCtrl, deleteUserCtrl, listUsers } from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireRole('admin'));

router.get('/users', listUsers);
router.post('/create-user', createUserCtrl);
router.delete('/user/:id', deleteUserCtrl);

export default router;
