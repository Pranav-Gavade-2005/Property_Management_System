import { Router } from 'express';
import { 
  createApplication, 
  getApplicationsByTenant, 
  getApplicationsByOwner, 
  getAllApplications, 
  updateApplicationStatus, 
  deleteApplication 
} from '../controllers/propertyApplicationController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Apply for a property (tenant only)
router.post('/', requireAuth, createApplication);

// Get applications by tenant
router.get('/tenant', requireAuth, getApplicationsByTenant);

// Get applications by owner
router.get('/owner', requireAuth, getApplicationsByOwner);

// Get all applications (admin only)
router.get('/all', requireAuth, getAllApplications);

// Update application status (owner/admin)
router.put('/:id/status', requireAuth, updateApplicationStatus);

// Delete application (tenant/admin)
router.delete('/:id', requireAuth, deleteApplication);

export default router;
