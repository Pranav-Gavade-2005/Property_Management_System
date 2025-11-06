import pool from '../db.js';

export async function createApplication(applicationData) {
  const {
    property_id,
    tenant_id,
    message,
    monthly_income
  } = applicationData;

  const { rows } = await pool.query(
    `INSERT INTO property_applications 
     (property_id, tenant_id, message, monthly_income)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [property_id, tenant_id, message || '', monthly_income || null]
  );
  return rows[0];
}

export async function getApplicationsByProperty(propertyId) {
  const { rows } = await pool.query(
    `SELECT pa.*, u.name as tenant_name, u.email as tenant_email, u.phone as tenant_phone
     FROM property_applications pa
     JOIN users u ON pa.tenant_id = u.id
     WHERE pa.property_id = $1
     ORDER BY pa.application_date DESC`,
    [propertyId]
  );
  return rows;
}

export async function getApplicationsByTenant(tenantId) {
  const { rows } = await pool.query(
    `SELECT pa.*, p.title as property_title, p.address, p.rent, 
            u.name as owner_name, u.email as owner_email, u.phone as owner_phone
     FROM property_applications pa
     JOIN properties p ON pa.property_id = p.id
     JOIN users u ON p.owner_id = u.id
     WHERE pa.tenant_id = $1
     ORDER BY pa.application_date DESC`,
    [tenantId]
  );
  return rows;
}

export async function getApplicationsByOwner(ownerId) {
  const { rows } = await pool.query(
    `SELECT pa.*, p.title as property_title, p.address, p.rent,
            t.name as tenant_name, t.email as tenant_email, t.phone as tenant_phone
     FROM property_applications pa
     JOIN properties p ON pa.property_id = p.id
     JOIN users t ON pa.tenant_id = t.id
     WHERE p.owner_id = $1
     ORDER BY pa.application_date DESC`,
    [ownerId]
  );
  return rows;
}

export async function getAllApplications() {
  const { rows } = await pool.query(
    `SELECT pa.*, p.title as property_title, p.address, p.rent,
            t.name as tenant_name, t.email as tenant_email, t.phone as tenant_phone,
            o.name as owner_name, o.email as owner_email
     FROM property_applications pa
     JOIN properties p ON pa.property_id = p.id
     JOIN users t ON pa.tenant_id = t.id
     JOIN users o ON p.owner_id = o.id
     ORDER BY pa.application_date DESC`
  );
  return rows;
}

export async function updateApplicationStatus(applicationId, status, approvedBy = null) {
  const { rows } = await pool.query(
    `UPDATE property_applications 
     SET status = $1, approved_by = $2
     WHERE id = $3 RETURNING *`,
    [status, approvedBy, applicationId]
  );
  return rows[0];
}

export async function getApplicationById(applicationId) {
  const { rows } = await pool.query(
    `SELECT pa.*, p.title as property_title, p.address, p.rent,
            t.name as tenant_name, t.email as tenant_email, t.phone as tenant_phone,
            o.name as owner_name, o.id as owner_id
     FROM property_applications pa
     JOIN properties p ON pa.property_id = p.id
     JOIN users t ON pa.tenant_id = t.id
     JOIN users o ON p.owner_id = o.id
     WHERE pa.id = $1`,
    [applicationId]
  );
  return rows[0];
}

export async function deleteApplication(applicationId) {
  await pool.query('DELETE FROM property_applications WHERE id = $1', [applicationId]);
}

export async function checkExistingApplication(propertyId, tenantId) {
  const { rows } = await pool.query(
    'SELECT * FROM property_applications WHERE property_id = $1 AND tenant_id = $2',
    [propertyId, tenantId]
  );
  return rows[0];
}
