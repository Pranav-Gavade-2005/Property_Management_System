import pool from '../db.js';

export async function createProperty({ owner_id, title, address, rent }) {
  const { rows } = await pool.query(
    `INSERT INTO properties(owner_id, title, address, rent)
     VALUES($1,$2,$3,$4) RETURNING *`,
    [owner_id, title, address, rent]
  );
  return rows[0];
}

export async function getPropertiesByOwner(ownerId) {
  const { rows } = await pool.query('SELECT * FROM properties WHERE owner_id=$1 ORDER BY id ASC', [ownerId]);
  return rows;
}

export async function updateProperty(id, { title, address, rent }) {
  const { rows } = await pool.query(
    `UPDATE properties SET title=$1, address=$2, rent=$3 WHERE id=$4 RETURNING *`,
    [title, address, rent, id]
  );
  return rows[0];
}

export async function deleteProperty(id) {
  await pool.query('DELETE FROM properties WHERE id=$1', [id]);
}

export async function assignTenant(propertyId, tenantId) {
  const { rows } = await pool.query(
    'UPDATE properties SET tenant_id=$1 WHERE id=$2 RETURNING *',
    [tenantId, propertyId]
  );
  return rows[0];
}

export async function toggleRentStatus(propertyId, paid) {
  const { rows } = await pool.query(
    'UPDATE properties SET rent_paid=$1 WHERE id=$2 RETURNING *',
    [paid, propertyId]
  );
  return rows[0];
}

export async function getPropertyByTenantId(tenantId) {
  const { rows } = await pool.query('SELECT * FROM properties WHERE tenant_id=$1', [tenantId]);
  return rows[0];
}
