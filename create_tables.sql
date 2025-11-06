-- ========================================
-- PROPERTY MANAGEMENT SYSTEM DATABASE SCHEMA
-- Complete database setup for property management
-- ========================================

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS property_applications CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(80) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','owner','tenant')),
  phone VARCHAR(15),
  assigned_property INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  owner_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  rent NUMERIC(10,2) NOT NULL,
  bedrooms INT DEFAULT 1,
  bathrooms INT DEFAULT 1,
  property_type VARCHAR(50) DEFAULT 'apartment',
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  tenant_id INT NULL REFERENCES users(id),
  rent_paid BOOLEAN DEFAULT false,
  image_path VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property Applications table
CREATE TABLE property_applications (
  id SERIAL PRIMARY KEY,
  property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  monthly_income NUMERIC(10,2),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_by INT NULL REFERENCES users(id),
  UNIQUE(property_id, tenant_id)
);

-- Add foreign key constraint for assigned_property after properties table is created
ALTER TABLE users ADD CONSTRAINT fk_users_assigned_property 
  FOREIGN KEY (assigned_property) REFERENCES properties(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_tenant_id ON properties(tenant_id);
CREATE INDEX idx_property_applications_property_id ON property_applications(property_id);
CREATE INDEX idx_property_applications_tenant_id ON property_applications(tenant_id);
CREATE INDEX idx_property_applications_status ON property_applications(status);

-- Add comments for documentation
COMMENT ON TABLE users IS 'System users with different roles (admin, owner, tenant)';
COMMENT ON TABLE properties IS 'Property listings with details and status';
COMMENT ON TABLE property_applications IS 'Tenant applications for properties';

COMMENT ON COLUMN properties.image_path IS 'Path to property image file stored on server';
COMMENT ON COLUMN properties.status IS 'Property availability status';
COMMENT ON COLUMN property_applications.status IS 'Application approval status';

-- Success message
SELECT 'Database schema created successfully! Ready for property management system.' as message;
