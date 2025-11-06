import { assignTenant, createProperty, deleteProperty, getPropertiesByOwner, toggleRentStatus, updateProperty } from '../models/propertyModel.js';
import { setAssignedProperty } from '../models/userModel.js';

export async function createPropertyCtrl(req, res) {
  const owner_id = req.session.user.id;
  const { title, address, rent } = req.body;
  const property = await createProperty({ owner_id, title, address, rent });
  res.status(201).json({ property });
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
