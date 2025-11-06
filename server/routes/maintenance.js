import { Router } from 'express';
import { 
  createMaintenanceRequest, 
  getMaintenanceRequestsByTenant, 
  getMaintenanceRequestsByOwner, 
  getAllMaintenanceRequests, 
  updateMaintenanceRequest, 
  deleteMaintenanceRequest 
} from '../controllers/maintenanceController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Create maintenance request (tenant only)
router.post('/', requireAuth, createMaintenanceRequest);

// Get maintenance requests by tenant
router.get('/tenant', requireAuth, getMaintenanceRequestsByTenant);

// Get maintenance requests by owner
router.get('/owner', requireAuth, getMaintenanceRequestsByOwner);

// Get all maintenance requests (admin only)
router.get('/all', requireAuth, getAllMaintenanceRequests);

// Update maintenance request
router.put('/:id', requireAuth, updateMaintenanceRequest);

// Delete maintenance request
router.delete('/:id', requireAuth, deleteMaintenanceRequest);

export default router;
