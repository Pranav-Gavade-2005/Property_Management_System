// ========================================
// PROPERTY MANAGEMENT SYSTEM - SAMPLE DATA
// Complete seed script for development and testing
// ========================================

import pool from './server/db.js';
import bcrypt from 'bcrypt';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...');
    await pool.query('DELETE FROM property_applications');
    await pool.query('DELETE FROM properties');
    await pool.query('DELETE FROM users');
    await pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE properties_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE property_applications_id_seq RESTART WITH 1');
    console.log('✅ Existing data cleared\n');

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('🔐 Password hashed for all users\n');

    // ========================================
    // CREATE USERS
    // ========================================
    console.log('👥 Creating users...');

    // Admin user
    const adminResult = await pool.query(`
      INSERT INTO users (name, email, password, role, phone) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, name, email, role
    `, ['Admin User', 'admin@example.com', hashedPassword, 'admin', '555-0001']);
    console.log(`   ✅ Admin: ${adminResult.rows[0].name} (${adminResult.rows[0].email})`);

    // Property owners
    const owner1Result = await pool.query(`
      INSERT INTO users (name, email, password, role, phone) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, name, email, role
    `, ['John Smith', 'owner@example.com', hashedPassword, 'owner', '555-0002']);
    console.log(`   ✅ Owner: ${owner1Result.rows[0].name} (${owner1Result.rows[0].email})`);

    const owner2Result = await pool.query(`
      INSERT INTO users (name, email, password, role, phone) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, name, email, role
    `, ['Sarah Johnson', 'sarah.owner@example.com', hashedPassword, 'owner', '555-0003']);
    console.log(`   ✅ Owner: ${owner2Result.rows[0].name} (${owner2Result.rows[0].email})`);

    // Tenants
    const tenant1Result = await pool.query(`
      INSERT INTO users (name, email, password, role, phone) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, name, email, role
    `, ['Jane Doe', 'tenant@example.com', hashedPassword, 'tenant', '555-0004']);
    console.log(`   ✅ Tenant: ${tenant1Result.rows[0].name} (${tenant1Result.rows[0].email})`);

    const tenant2Result = await pool.query(`
      INSERT INTO users (name, email, password, role, phone) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, name, email, role
    `, ['Mike Wilson', 'mike.tenant@example.com', hashedPassword, 'tenant', '555-0005']);
    console.log(`   ✅ Tenant: ${tenant2Result.rows[0].name} (${tenant2Result.rows[0].email})`);

    const tenant3Result = await pool.query(`
      INSERT INTO users (name, email, password, role, phone) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, name, email, role
    `, ['Emily Davis', 'emily.tenant@example.com', hashedPassword, 'tenant', '555-0006']);
    console.log(`   ✅ Tenant: ${tenant3Result.rows[0].name} (${tenant3Result.rows[0].email})`);

    const owner1Id = owner1Result.rows[0].id;
    const owner2Id = owner2Result.rows[0].id;
    const tenant1Id = tenant1Result.rows[0].id;
    const tenant2Id = tenant2Result.rows[0].id;
    const tenant3Id = tenant3Result.rows[0].id;

    console.log('\n🏠 Creating properties...');

    // ========================================
    // CREATE PROPERTIES
    // ========================================

    // Properties for Owner 1 (John Smith)
    const properties1 = [
      {
        title: 'Beautiful Downtown Apartment',
        description: 'Modern 2-bedroom apartment in the heart of downtown with stunning city views, hardwood floors, and updated kitchen. Walking distance to restaurants, shopping, and public transportation.',
        address: '123 Main St, Downtown, City 12345',
        rent: 1500.00,
        bedrooms: 2,
        bathrooms: 2,
        property_type: 'apartment',
        status: 'available'
      },
      {
        title: 'Cozy Studio Near University',
        description: 'Perfect for students! Furnished studio apartment just 5 minutes walk from campus. All utilities included, high-speed internet, and laundry facilities in building.',
        address: '456 College Ave, University District, City 12346',
        rent: 800.00,
        bedrooms: 1,
        bathrooms: 1,
        property_type: 'studio',
        status: 'available'
      },
      {
        title: 'Spacious Family House',
        description: 'Large 3-bedroom house with backyard, perfect for families. Features include updated kitchen, hardwood floors, garage, and quiet neighborhood.',
        address: '789 Oak Street, Suburbs, City 12347',
        rent: 2200.00,
        bedrooms: 3,
        bathrooms: 2,
        property_type: 'house',
        status: 'occupied',
        tenant_id: tenant1Id,
        rent_paid: true
      }
    ];

    // Properties for Owner 2 (Sarah Johnson)
    const properties2 = [
      {
        title: 'Luxury Condo with Pool',
        description: 'High-end 2-bedroom condo in exclusive building with pool, gym, concierge services, and rooftop terrace. Premium finishes throughout.',
        address: '321 Luxury Blvd, Uptown, City 12348',
        rent: 2800.00,
        bedrooms: 2,
        bathrooms: 2,
        property_type: 'condo',
        status: 'available'
      },
      {
        title: 'Affordable 1BR Apartment',
        description: 'Budget-friendly 1-bedroom apartment in quiet, safe neighborhood. Recently renovated with new appliances and fresh paint.',
        address: '654 Quiet Lane, Peaceful Area, City 12349',
        rent: 950.00,
        bedrooms: 1,
        bathrooms: 1,
        property_type: 'apartment',
        status: 'available'
      },
      {
        title: 'Modern Townhouse',
        description: 'Contemporary 3-bedroom townhouse with attached garage, private patio, and modern amenities. Great for professionals or small families.',
        address: '987 Modern Way, New Development, City 12350',
        rent: 1900.00,
        bedrooms: 3,
        bathrooms: 2.5,
        property_type: 'townhouse',
        status: 'maintenance'
      },
      {
        title: 'Charming Garden Apartment',
        description: 'Ground floor apartment with private garden access. Pet-friendly with fenced yard area. Updated kitchen and bathroom.',
        address: '147 Garden Court, Green Valley, City 12351',
        rent: 1200.00,
        bedrooms: 2,
        bathrooms: 1,
        property_type: 'apartment',
        status: 'occupied',
        tenant_id: tenant2Id,
        rent_paid: false
      }
    ];

    // Insert properties for Owner 1
    for (const property of properties1) {
      const result = await pool.query(`
        INSERT INTO properties (owner_id, title, description, address, rent, bedrooms, bathrooms, property_type, status, tenant_id, rent_paid) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id, title, status
      `, [owner1Id, property.title, property.description, property.address, property.rent, 
          property.bedrooms, property.bathrooms, property.property_type, property.status,
          property.tenant_id || null, property.rent_paid || false]);
      
      console.log(`   ✅ ${result.rows[0].title} (${result.rows[0].status})`);
    }

    // Insert properties for Owner 2
    for (const property of properties2) {
      const result = await pool.query(`
        INSERT INTO properties (owner_id, title, description, address, rent, bedrooms, bathrooms, property_type, status, tenant_id, rent_paid) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id, title, status
      `, [owner2Id, property.title, property.description, property.address, property.rent, 
          property.bedrooms, property.bathrooms, property.property_type, property.status,
          property.tenant_id || null, property.rent_paid || false]);
      
      console.log(`   ✅ ${result.rows[0].title} (${result.rows[0].status})`);
    }

    console.log('\n📝 Creating property applications...');

    // ========================================
    // CREATE PROPERTY APPLICATIONS
    // ========================================

    // Get some property IDs for applications
    const availableProperties = await pool.query(`
      SELECT id, title, owner_id FROM properties WHERE status = 'available' LIMIT 4
    `);

    if (availableProperties.rows.length > 0) {
      // Application 1: Tenant 2 applies for first available property
      await pool.query(`
        INSERT INTO property_applications (property_id, tenant_id, message, monthly_income, status) 
        VALUES ($1, $2, $3, $4, $5)
      `, [
        availableProperties.rows[0].id,
        tenant2Id,
        'Hi! I am very interested in this property. I am a working professional with stable income and excellent references. I would love to schedule a viewing at your earliest convenience.',
        4500.00,
        'pending'
      ]);
      console.log(`   ✅ Application from Mike Wilson for "${availableProperties.rows[0].title}"`);

      // Application 2: Tenant 3 applies for second available property
      if (availableProperties.rows.length > 1) {
        await pool.query(`
          INSERT INTO property_applications (property_id, tenant_id, message, monthly_income, status) 
          VALUES ($1, $2, $3, $4, $5)
        `, [
          availableProperties.rows[1].id,
          tenant3Id,
          'Hello! This property looks perfect for my needs. I am a graduate student with a part-time job and can provide references from previous landlords. Please let me know if you need any additional information.',
          2800.00,
          'pending'
        ]);
        console.log(`   ✅ Application from Emily Davis for "${availableProperties.rows[1].title}"`);
      }

      // Application 3: Tenant 1 applies for third available property (if exists)
      if (availableProperties.rows.length > 2) {
        await pool.query(`
          INSERT INTO property_applications (property_id, tenant_id, message, monthly_income, status) 
          VALUES ($1, $2, $3, $4, $5)
        `, [
          availableProperties.rows[2].id,
          tenant1Id,
          'I am interested in renting this property for my family. We are quiet, responsible tenants with no pets. I have been at my current job for 3 years and can provide employment verification.',
          5200.00,
          'approved'
        ]);
        console.log(`   ✅ Application from Jane Doe for "${availableProperties.rows[2].title}" (APPROVED)`);
      }

      // Application 4: Another application (rejected example)
      if (availableProperties.rows.length > 3) {
        await pool.query(`
          INSERT INTO property_applications (property_id, tenant_id, message, monthly_income, status) 
          VALUES ($1, $2, $3, $4, $5)
        `, [
          availableProperties.rows[3].id,
          tenant3Id,
          'This would be my second choice property. Very interested and ready to move in immediately.',
          2800.00,
          'rejected'
        ]);
        console.log(`   ✅ Application from Emily Davis for "${availableProperties.rows[3].title}" (REJECTED)`);
      }
    }

    // ========================================
    // FINAL STATISTICS
    // ========================================
    console.log('\n📊 Gathering final statistics...');

    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const propertyCount = await pool.query('SELECT COUNT(*) FROM properties');
    const applicationCount = await pool.query('SELECT COUNT(*) FROM property_applications');

    const availableCount = await pool.query("SELECT COUNT(*) FROM properties WHERE status = 'available'");
    const occupiedCount = await pool.query("SELECT COUNT(*) FROM properties WHERE status = 'occupied'");
    const maintenanceCount = await pool.query("SELECT COUNT(*) FROM properties WHERE status = 'maintenance'");

    const pendingApps = await pool.query("SELECT COUNT(*) FROM property_applications WHERE status = 'pending'");
    const approvedApps = await pool.query("SELECT COUNT(*) FROM property_applications WHERE status = 'approved'");
    const rejectedApps = await pool.query("SELECT COUNT(*) FROM property_applications WHERE status = 'rejected'");

    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('📈 FINAL STATISTICS:');
    console.log('═══════════════════════════════════════');
    console.log(`👥 Total Users: ${userCount.rows[0].count}`);
    console.log(`   • Admins: 1`);
    console.log(`   • Owners: 2`);
    console.log(`   • Tenants: 3`);
    console.log('');
    console.log(`🏠 Total Properties: ${propertyCount.rows[0].count}`);
    console.log(`   • Available: ${availableCount.rows[0].count}`);
    console.log(`   • Occupied: ${occupiedCount.rows[0].count}`);
    console.log(`   • Maintenance: ${maintenanceCount.rows[0].count}`);
    console.log('');
    console.log(`📝 Total Applications: ${applicationCount.rows[0].count}`);
    console.log(`   • Pending: ${pendingApps.rows[0].count}`);
    console.log(`   • Approved: ${approvedApps.rows[0].count}`);
    console.log(`   • Rejected: ${rejectedApps.rows[0].count}`);
    console.log('');
    console.log('🔑 LOGIN CREDENTIALS:');
    console.log('═══════════════════════════════════════');
    console.log('👨‍💼 Admin Account:');
    console.log('   Email: admin@example.com');
    console.log('   Password: password123');
    console.log('');
    console.log('🏠 Property Owner Accounts:');
    console.log('   Email: owner@example.com');
    console.log('   Password: password123');
    console.log('   ');
    console.log('   Email: sarah.owner@example.com');
    console.log('   Password: password123');
    console.log('');
    console.log('🏠 Tenant Accounts:');
    console.log('   Email: tenant@example.com');
    console.log('   Password: password123');
    console.log('   ');
    console.log('   Email: mike.tenant@example.com');
    console.log('   Password: password123');
    console.log('   ');
    console.log('   Email: emily.tenant@example.com');
    console.log('   Password: password123');
    console.log('');
    console.log('🚀 Ready to start the application!');
    console.log('   Frontend: http://localhost:5173');
    console.log('   Backend: http://localhost:4000');
    console.log('');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
    console.log('🔌 Database connection closed.');
  }
}

// Run the seeding function
seedDatabase();
