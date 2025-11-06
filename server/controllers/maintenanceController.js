import * as Maintenance from '../models/maintenanceModel.js';
import * as Property from '../models/propertyModel.js';

export async function createMaintenanceRequest(req, res) {
  try {
    const tenant_id = req.session.user.id;
    
    if (req.session.user.role !== 'tenant') {
      return res.status(403).json({ error: 'Only tenants can create maintenance requests' });
    }

    const { property_id } = req.body;
    
    // Verify tenant has access to this property
    const property = await Property.getPropertyById(property_id);
    if (!property || property.tenant_id !== tenant_id) {
      return res.status(403).json({ error: 'You can only create requests for your assigned property' });
    }

    const request = await Maintenance.createMaintenanceRequest({
      ...req.body,
      tenant_id
    });

    res.status(201).json({
      message: 'Maintenance request created successfully',
      request
    });
  } catch (error) {
    console.error('Error creating maintenance request:', error);
    res.status(500).json({ error: 'Failed to create maintenance request' });
  }
}

export async function getMaintenanceRequestsByTenant(req, res) {
  try {
    const tenant_id = req.session.user.id;
    const requests = await Maintenance.getMaintenanceRequestsByTenant(tenant_id);
    res.json(requests);
  } catch (error) {
    console.error('Error fetching tenant maintenance requests:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance requests' });
  }
}

export async function getMaintenanceRequestsByOwner(req, res) {
  try {
    const owner_id = req.session.user.id;
    const requests = await Maintenance.getMaintenanceRequestsByOwner(owner_id);
    res.json(requests);
  } catch (error) {
    console.error('Error fetching owner maintenance requests:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance requests' });
  }
}

export async function getAllMaintenanceRequests(req, res) {
  try {
    if (req.session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const requests = await Maintenance.getAllMaintenanceRequests();
    res.json(requests);
  } catch (error) {
    console.error('Error fetching all maintenance requests:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance requests' });
  }
}

export async function updateMaintenanceRequest(req, res) {
  try {
    const { id } = req.params;
    const user = req.session.user;

    const request = await Maintenance.getMaintenanceRequestById(id);
    if (!request) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }

    // Check permissions
    if (user.role === 'tenant' && request.tenant_id !== user.id) {
      return res.status(403).json({ error: 'You can only update your own requests' });
    }

    if (user.role === 'owner' && request.owner_id !== user.id) {
      return res.status(403).json({ error: 'You can only update requests for your properties' });
    }

    const updatedRequest = await Maintenance.updateMaintenanceRequest(id, req.body);

    res.json({
      message: 'Maintenance request updated successfully',
      request: updatedRequest
    });
  } catch (error) {
    console.error('Error updating maintenance request:', error);
    res.status(500).json({ error: 'Failed to update maintenance request' });
  }
}

export async function deleteMaintenanceRequest(req, res) {
  try {
    const { id } = req.params;
    const user = req.session.user;

    const request = await Maintenance.getMaintenanceRequestById(id);
    if (!request) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }

    // Only tenant who created it or admin can delete
    if (user.role === 'tenant' && request.tenant_id !== user.id) {
      return res.status(403).json({ error: 'You can only delete your own requests' });
    }

    if (user.role === 'owner') {
      return res.status(403).json({ error: 'Owners cannot delete maintenance requests' });
    }

    await Maintenance.deleteMaintenanceRequest(id);
    res.json({ message: 'Maintenance request deleted successfully' });
  } catch (error) {
    console.error('Error deleting maintenance request:', error);
    res.status(500).json({ error: 'Failed to delete maintenance request' });
  }
}
