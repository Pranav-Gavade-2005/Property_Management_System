import pool from '../db.js';

export async function createMaintenanceRequest(requestData) {
  const {
    property_id,
    tenant_id,
    title,
    description,
    priority,
    category,
    images
  } = requestData;

  const { rows } = await pool.query(
    `INSERT INTO maintenance_requests 
     (property_id, tenant_id, title, description, priority, category, images)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [property_id, tenant_id, title, description, priority, category, images]
  );
  return rows[0];
}

export async function getMaintenanceRequestsByProperty(propertyId) {
  const { rows } = await pool.query(
    `SELECT mr.*, u.name as tenant_name, u.email as tenant_email,
            a.name as assigned_name
     FROM maintenance_requests mr
     JOIN users u ON mr.tenant_id = u.id
     LEFT JOIN users a ON mr.assigned_to = a.id
     WHERE mr.property_id = $1
     ORDER BY mr.created_at DESC`,
    [propertyId]
  );
  return rows;
}

export async function getMaintenanceRequestsByTenant(tenantId) {
  const { rows } = await pool.query(
    `SELECT mr.*, p.title as property_title, p.address,
            o.name as owner_name, o.email as owner_email,
            a.name as assigned_name
     FROM maintenance_requests mr
     JOIN properties p ON mr.property_id = p.id
     JOIN users o ON p.owner_id = o.id
     LEFT JOIN users a ON mr.assigned_to = a.id
     WHERE mr.tenant_id = $1
     ORDER BY mr.created_at DESC`,
    [tenantId]
  );
  return rows;
}

export async function getMaintenanceRequestsByOwner(ownerId) {
  const { rows } = await pool.query(
    `SELECT mr.*, p.title as property_title, p.address,
            t.name as tenant_name, t.email as tenant_email,
            a.name as assigned_name
     FROM maintenance_requests mr
     JOIN properties p ON mr.property_id = p.id
     JOIN users t ON mr.tenant_id = t.id
     LEFT JOIN users a ON mr.assigned_to = a.id
     WHERE p.owner_id = $1
     ORDER BY mr.created_at DESC`,
    [ownerId]
  );
  return rows;
}

export async function getAllMaintenanceRequests() {
  const { rows } = await pool.query(
    `SELECT mr.*, p.title as property_title, p.address,
            t.name as tenant_name, t.email as tenant_email,
            o.name as owner_name, o.email as owner_email,
            a.name as assigned_name
     FROM maintenance_requests mr
     JOIN properties p ON mr.property_id = p.id
     JOIN users t ON mr.tenant_id = t.id
     JOIN users o ON p.owner_id = o.id
     LEFT JOIN users a ON mr.assigned_to = a.id
     ORDER BY mr.created_at DESC`
  );
  return rows;
}

export async function updateMaintenanceRequest(requestId, updateData) {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  });

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(requestId);

  const query = `UPDATE maintenance_requests SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function getMaintenanceRequestById(requestId) {
  const { rows } = await pool.query(
    `SELECT mr.*, p.title as property_title, p.address,
            t.name as tenant_name, t.email as tenant_email,
            o.name as owner_name, o.id as owner_id,
            a.name as assigned_name
     FROM maintenance_requests mr
     JOIN properties p ON mr.property_id = p.id
     JOIN users t ON mr.tenant_id = t.id
     JOIN users o ON p.owner_id = o.id
     LEFT JOIN users a ON mr.assigned_to = a.id
     WHERE mr.id = $1`,
    [requestId]
  );
  return rows[0];
}

export async function deleteMaintenanceRequest(requestId) {
  await pool.query('DELETE FROM maintenance_requests WHERE id = $1', [requestId]);
}
