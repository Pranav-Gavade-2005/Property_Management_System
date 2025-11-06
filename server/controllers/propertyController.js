import { 
  assignTenant, 
  createProperty, 
  deleteProperty, 
  getPropertiesByOwner, 
  toggleRentStatus, 
  updateProperty,
  getAllProperties,
  getAvailableProperties,
  searchProperties,
  getPropertyById,
  updatePropertyStatus,
  updatePropertyDetails,
  updatePropertyImage
} from '../models/propertyModel.js';
import { setAssignedProperty } from '../models/userModel.js';

export async function createPropertyCtrl(req, res) {
  try {
    const owner_id = req.session.user.id;
    let imagePath = null;
    
    // Handle image upload if present
    if (req.file) {
      imagePath = `/uploads/properties/${req.file.filename}`;
    }
    
    const property = await createProperty({ 
      ...req.body, 
      owner_id,
      image_path: imagePath
    });
    
    // If we have an image and property was created, rename file to use property ID
    if (req.file && property.id) {
      const fs = await import('fs');
      const path = await import('path');
      const oldPath = req.file.path;
      const newFilename = `property-${property.id}${path.extname(req.file.originalname)}`;
      const newPath = path.join('uploads/properties', newFilename);
      
      try {
        fs.renameSync(oldPath, newPath);
        const finalImagePath = `/uploads/properties/${newFilename}`;
        await updatePropertyImage(property.id, finalImagePath);
        property.image_path = finalImagePath;
      } catch (renameError) {
        console.error('Error renaming file:', renameError);
      }
    }
    
    res.status(201).json({ property });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
}

export async function listOwnerProperties(req, res) {
  const { id } = req.params; // owner id
  const properties = await getPropertiesByOwner(id);
  res.json({ properties });
}

export async function updatePropertyCtrl(req, res) {
  const { id } = req.params;
  const { title, address, rent } = req.body;
  const property = await updateProperty(id, { title, address, rent });
  res.json({ property });
}

export async function deletePropertyCtrl(req, res) {
  const { id } = req.params;
  await deleteProperty(id);
  res.json({ ok: true });
}

export async function assignTenantCtrl(req, res) {
  const { id } = req.params; // property id
  const { tenant_id } = req.body;
  const property = await assignTenant(id, tenant_id || null);
  if (tenant_id) await setAssignedProperty(tenant_id, id);
  res.json({ property });
}

export async function rentStatusCtrl(req, res) {
  const { id } = req.params; // property id
  const { paid } = req.body;
  const property = await toggleRentStatus(id, !!paid);
  res.json({ property });
}

export async function getAllPropertiesCtrl(req, res) {
  try {
    const properties = await getAllProperties();
    res.json({ properties });
  } catch (error) {
    console.error('Error fetching all properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
}

export async function getAvailablePropertiesCtrl(req, res) {
  try {
    console.log('Fetching available properties...');
    const properties = await getAvailableProperties();
    console.log('Found properties:', properties.length);
    res.json({ properties });
  } catch (error) {
    console.error('Error fetching available properties:', error);
    res.status(500).json({ error: 'Failed to fetch available properties', details: error.message });
  }
}

export async function searchPropertiesCtrl(req, res) {
  try {
    const { search, minRent, maxRent, bedrooms, property_type } = req.query;
    console.log('Search params:', { search, minRent, maxRent, bedrooms, property_type });
    
    const properties = await searchProperties({ 
      search, 
      minRent: minRent ? parseFloat(minRent) : null, 
      maxRent: maxRent ? parseFloat(maxRent) : null,
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      property_type
    });
    
    console.log('Search results:', properties.length);
    res.json({ properties });
  } catch (error) {
    console.error('Error searching properties:', error);
    res.status(500).json({ error: 'Failed to search properties', details: error.message });
  }
}

export async function getPropertyByIdCtrl(req, res) {
  try {
    const { id } = req.params;
    const property = await getPropertyById(id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ property });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
}

export async function updatePropertyStatusCtrl(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.session.user;

    const property = await getPropertyById(id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check permissions
    if (user.role === 'tenant') {
      return res.status(403).json({ error: 'Tenants cannot update property status' });
    }

    if (user.role === 'owner' && property.owner_id !== user.id) {
      return res.status(403).json({ error: 'You can only update your own properties' });
    }

    const updatedProperty = await updatePropertyStatus(id, status);
    res.json({ property: updatedProperty });
  } catch (error) {
    console.error('Error updating property status:', error);
    res.status(500).json({ error: 'Failed to update property status' });
  }
}

export async function updatePropertyDetailsCtrl(req, res) {
  try {
    const { id } = req.params;
    const user = req.session.user;

    const property = await getPropertyById(id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check permissions
    if (user.role === 'tenant') {
      return res.status(403).json({ error: 'Tenants cannot update properties' });
    }

    if (user.role === 'owner' && property.owner_id !== user.id) {
      return res.status(403).json({ error: 'You can only update your own properties' });
    }

    const updatedProperty = await updatePropertyDetails(id, req.body);
    res.json({ property: updatedProperty });
  } catch (error) {
    console.error('Error updating property details:', error);
    res.status(500).json({ error: 'Failed to update property details' });
  }
}

export async function uploadPropertyImageCtrl(req, res) {
  try {
    const { id } = req.params;
    const user = req.session.user;

    // Check if property exists and user owns it
    const property = await getPropertyById(id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (user.role !== 'admin' && property.owner_id !== user.id) {
      return res.status(403).json({ error: 'You can only update your own properties' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Delete old image if it exists
    if (property.image_path) {
      const fs = await import('fs');
      const path = await import('path');
      const oldImagePath = path.join(process.cwd(), 'uploads/properties', path.basename(property.image_path));
      try {
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (deleteError) {
        console.error('Error deleting old image:', deleteError);
      }
    }

    // Rename uploaded file to use property ID
    const fs = await import('fs');
    const path = await import('path');
    const oldPath = req.file.path;
    const newFilename = `property-${id}${path.extname(req.file.originalname)}`;
    const newPath = path.join('uploads/properties', newFilename);
    
    try {
      fs.renameSync(oldPath, newPath);
      const finalImagePath = `/uploads/properties/${newFilename}`;
      
      // Update database
      const updatedProperty = await updatePropertyImage(id, finalImagePath);
      
      res.json({ 
        message: 'Image uploaded successfully',
        property: updatedProperty 
      });
    } catch (renameError) {
      console.error('Error renaming file:', renameError);
      res.status(500).json({ error: 'Failed to process image' });
    }

  } catch (error) {
    console.error('Error uploading property image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
}
