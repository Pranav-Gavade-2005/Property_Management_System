import pool from '../db.js';

export async function createProperty(propertyData) {
  const {
    owner_id,
    title,
    description,
    address,
    rent,
    bedrooms,
    bathrooms,
    property_type,
    image_path
  } = propertyData;

  const { rows } = await pool.query(
    `INSERT INTO properties(owner_id, title, description, address, rent, bedrooms, bathrooms, property_type, image_path)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [owner_id, title, description || '', address, rent, bedrooms || 1, bathrooms || 1, property_type || 'apartment', image_path || null]
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

export async function getAllProperties() {
  const { rows } = await pool.query(
    `SELECT p.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone
     FROM properties p
     JOIN users u ON p.owner_id = u.id
     ORDER BY p.created_at DESC`
  );
  return rows;
}

export async function getAvailableProperties() {
  const { rows } = await pool.query(
    `SELECT p.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone
     FROM properties p
     JOIN users u ON p.owner_id = u.id
     WHERE p.status = 'available'
     ORDER BY p.created_at DESC`
  );
  return rows;
}

export async function searchProperties({ search, minRent, maxRent, bedrooms, property_type }) {
  let query = `
    SELECT p.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone
    FROM properties p
    JOIN users u ON p.owner_id = u.id
    WHERE p.status = 'available'
  `;
  const params = [];
  let paramIndex = 1;

  if (search) {
    query += ` AND (p.title ILIKE $${paramIndex} OR p.address ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (minRent) {
    query += ` AND p.rent >= $${paramIndex}`;
    params.push(minRent);
    paramIndex++;
  }

  if (maxRent) {
    query += ` AND p.rent <= $${paramIndex}`;
    params.push(maxRent);
    paramIndex++;
  }

  if (bedrooms) {
    query += ` AND p.bedrooms >= $${paramIndex}`;
    params.push(bedrooms);
    paramIndex++;
  }

  if (property_type) {
    query += ` AND p.property_type = $${paramIndex}`;
    params.push(property_type);
    paramIndex++;
  }

  query += ' ORDER BY p.created_at DESC';

  const { rows } = await pool.query(query, params);
  return rows;
}

export async function getPropertyById(propertyId) {
  const { rows } = await pool.query(
    `SELECT p.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone
     FROM properties p
     JOIN users u ON p.owner_id = u.id
     WHERE p.id = $1`,
    [propertyId]
  );
  return rows[0];
}

export async function updatePropertyStatus(propertyId, status) {
  const { rows } = await pool.query(
    'UPDATE properties SET status = $1 WHERE id = $2 RETURNING *',
    [status, propertyId]
  );
  return rows[0];
}

export async function updatePropertyDetails(propertyId, updateData) {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined && key !== 'id') {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  });

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  values.push(propertyId);

  const query = `UPDATE properties SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function updatePropertyImage(propertyId, imagePath) {
  const { rows } = await pool.query(
    'UPDATE properties SET image_path = $1 WHERE id = $2 RETURNING *',
    [imagePath, propertyId]
  );
  return rows[0];
}
