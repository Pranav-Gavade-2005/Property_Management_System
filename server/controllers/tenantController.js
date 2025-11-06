import { getPropertyByTenantId } from '../models/propertyModel.js';
import { updateUserProfile } from '../models/userModel.js';

export async function tenantProperty(req, res) {
  const tenantId = req.session.user.id;
  const property = await getPropertyByTenantId(tenantId);
  res.json({ property });
}

export async function updateProfile(req, res) {
  const tenantId = req.session.user.id;
  const { name, phone } = req.body;
  const user = await updateUserProfile(tenantId, { name, phone });
  res.json({ user });
}
