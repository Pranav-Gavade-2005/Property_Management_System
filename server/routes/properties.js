import { Router } from 'express';
import { assignTenantCtrl, createPropertyCtrl, deletePropertyCtrl, listOwnerProperties, rentStatusCtrl, updatePropertyCtrl } from '../controllers/propertyController.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireRoles(['owner', 'admin']));

router.post('/', createPropertyCtrl);
router.get('/owner/:id', listOwnerProperties);
router.put('/:id', updatePropertyCtrl);
router.delete('/:id', deletePropertyCtrl);
router.put('/assign-tenant/:id', assignTenantCtrl);
router.put('/rent-status/:id', rentStatusCtrl);

export default router;
