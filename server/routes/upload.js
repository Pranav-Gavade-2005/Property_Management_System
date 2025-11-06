import { Router } from 'express';
import upload from '../middleware/upload.js';
import { uploadPropertyImages, deletePropertyImage } from '../controllers/uploadController.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';

const router = Router();

// Upload property images (owner/admin only)
router.post('/property-images', 
  requireAuth, 
  requireRoles(['owner', 'admin']), 
  upload.array('images', 10), // Allow up to 10 images
  uploadPropertyImages
);

// Delete property image (owner/admin only)
router.delete('/property-images/:filename', 
  requireAuth, 
  requireRoles(['owner', 'admin']), 
  deletePropertyImage
);

export default router;
