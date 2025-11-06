import * as PropertyApplication from '../models/propertyApplicationModel.js';
import * as Property from '../models/propertyModel.js';

export async function createApplication(req, res) {
  try {
    const tenant_id = req.session.user.id;
    
    if (req.session.user.role !== 'tenant') {
      return res.status(403).json({ error: 'Only tenants can apply for properties' });
    }

    const { property_id } = req.body;
    
    // Check if property exists and is available
    const property = await Property.getPropertyById(property_id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.status !== 'available') {
      return res.status(400).json({ error: 'Property is not available for lease' });
    }

    // Check if application already exists
    const existingApplication = await PropertyApplication.checkExistingApplication(property_id, tenant_id);
    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this property' });
    }

    const application = await PropertyApplication.createApplication({
      ...req.body,
      tenant_id
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
}

export async function getApplicationsByTenant(req, res) {
  try {
    const tenant_id = req.session.user.id;
    const applications = await PropertyApplication.getApplicationsByTenant(tenant_id);
    res.json(applications);
  } catch (error) {
    console.error('Error fetching tenant applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
}

export async function getApplicationsByOwner(req, res) {
  try {
    const owner_id = req.session.user.id;
    const applications = await PropertyApplication.getApplicationsByOwner(owner_id);
    res.json(applications);
  } catch (error) {
    console.error('Error fetching owner applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
}

export async function getAllApplications(req, res) {
  try {
    if (req.session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const applications = await PropertyApplication.getAllApplications();
    res.json(applications);
  } catch (error) {
    console.error('Error fetching all applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
}

export async function updateApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.session.user;

    const application = await PropertyApplication.getApplicationById(id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check permissions
    if (user.role === 'tenant') {
      return res.status(403).json({ error: 'Tenants cannot update application status' });
    }

    if (user.role === 'owner' && application.owner_id !== user.id) {
      return res.status(403).json({ error: 'You can only update applications for your properties' });
    }

    const updatedApplication = await PropertyApplication.updateApplicationStatus(
      id, 
      status, 
      user.id
    );

    // If approved, update property status and assign tenant
    if (status === 'approved') {
      await Property.assignTenant(application.property_id, application.tenant_id);
      await Property.updatePropertyStatus(application.property_id, 'occupied');
      
      // Reject other pending applications for this property
      const otherApplications = await PropertyApplication.getApplicationsByProperty(application.property_id);
      for (const app of otherApplications) {
        if (app.id !== parseInt(id) && app.status === 'pending') {
          await PropertyApplication.updateApplicationStatus(app.id, 'rejected', user.id);
        }
      }
    }

    res.json({
      message: `Application ${status} successfully`,
      application: updatedApplication
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
}

export async function deleteApplication(req, res) {
  try {
    const { id } = req.params;
    const user = req.session.user;

    const application = await PropertyApplication.getApplicationById(id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Only the tenant who created the application or admin can delete it
    if (user.role === 'tenant' && application.tenant_id !== user.id) {
      return res.status(403).json({ error: 'You can only delete your own applications' });
    }

    if (user.role === 'owner') {
      return res.status(403).json({ error: 'Owners cannot delete applications' });
    }

    await PropertyApplication.deleteApplication(id);
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
}
