import { Router } from 'express';
import { 
  assignTenantCtrl, 
  createPropertyCtrl, 
  deletePropertyCtrl, 
  listOwnerProperties, 
  rentStatusCtrl, 
  updatePropertyCtrl,
  getAllPropertiesCtrl,
  getAvailablePropertiesCtrl,
  searchPropertiesCtrl,
  getPropertyByIdCtrl,
  updatePropertyStatusCtrl,
  updatePropertyDetailsCtrl,
  uploadPropertyImageCtrl
} from '../controllers/propertyController.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

// Public routes (accessible to all authenticated users)
router.get('/search', requireAuth, searchPropertiesCtrl);
router.get('/available', requireAuth, getAvailablePropertiesCtrl);
router.get('/all', requireAuth, getAllPropertiesCtrl);
router.get('/:id', requireAuth, getPropertyByIdCtrl);

// Protected routes (owner/admin only)
router.use(requireAuth, requireRoles(['owner', 'admin']));

router.post('/', upload.single('image'), createPropertyCtrl);
router.get('/owner/:id', listOwnerProperties);
router.put('/:id', updatePropertyCtrl);
router.put('/:id/details', updatePropertyDetailsCtrl);
router.put('/:id/status', updatePropertyStatusCtrl);
router.put('/:id/image', upload.single('image'), uploadPropertyImageCtrl);
router.delete('/:id', deletePropertyCtrl);
router.put('/assign-tenant/:id', assignTenantCtrl);
router.put('/rent-status/:id', rentStatusCtrl);

export default router;
