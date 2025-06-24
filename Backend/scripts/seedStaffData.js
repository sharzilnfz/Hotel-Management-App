import mongoose from 'mongoose';
import mongose_connect from '../db/connection.js';
import AccessLevel from '../models/staff/accessLevel.model.js';
import Department from '../models/staff/department.model.js';
import Role from '../models/staff/role.model.js';

// Staff data that matches the staff model enums
const rolesData = [
  {
    name: 'Administrator',
    description: 'Full system administrator with all permissions',
  },
  {
    name: 'Manager',
    description: 'Department manager with elevated permissions',
  },
  {
    name: 'Supervisor',
    description: 'Team supervisor with limited management access',
  },
  { name: 'Staff', description: 'Regular staff member with standard access' },
  { name: 'Intern', description: 'Temporary intern with limited access' },
  {
    name: 'Contractor',
    description: 'External contractor with project-specific access',
  },
];

const departmentsData = [
  { name: 'Management', description: 'Executive and senior management' },
  { name: 'Front Office', description: 'Guest services and reception' },
  { name: 'Housekeeping', description: 'Room cleaning and maintenance' },
  { name: 'Food & Beverage', description: 'Restaurant and catering services' },
  { name: 'Maintenance', description: 'Building and equipment maintenance' },
  { name: 'Spa & Wellness', description: 'Spa and wellness services' },
  { name: 'Security', description: 'Property security and safety' },
  { name: 'IT', description: 'Information technology and systems' },
  { name: 'Human Resources', description: 'Staff management and HR services' },
  { name: 'Sales & Marketing', description: 'Sales, marketing and promotions' },
];

const accessLevelsData = [
  { name: 'Full Access', description: 'Complete system access', level: 5 },
  {
    name: 'Administrative',
    description: 'Administrative functions access',
    level: 4,
  },
  { name: 'Standard', description: 'Standard operational access', level: 3 },
  { name: 'Limited', description: 'Limited departmental access', level: 2 },
  { name: 'Read Only', description: 'View-only access', level: 1 },
];

const seedStaffData = async () => {
  try {
    console.log('🌱 Starting staff data seeding...');

    // Connect to database
    await mongose_connect();
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Role.deleteMany({});
    await Department.deleteMany({});
    await AccessLevel.deleteMany({});

    // Seed Departments
    console.log('📁 Seeding departments...');
    const departments = await Department.insertMany(departmentsData);
    console.log(`✅ Created ${departments.length} departments`);

    // Seed Roles
    console.log('👥 Seeding roles...');
    const roles = await Role.insertMany(rolesData);
    console.log(`✅ Created ${roles.length} roles`);

    // Seed Access Levels
    console.log('🔐 Seeding access levels...');
    const accessLevels = await AccessLevel.insertMany(accessLevelsData);
    console.log(`✅ Created ${accessLevels.length} access levels`);

    console.log('🎉 Staff data seeding completed successfully!');

    // Display summary
    console.log('\n📊 Summary:');
    console.log(`Departments: ${departments.map((d) => d.name).join(', ')}`);
    console.log(`Roles: ${roles.map((r) => r.name).join(', ')}`);
    console.log(`Access Levels: ${accessLevels.map((a) => a.name).join(', ')}`);
  } catch (error) {
    console.error('❌ Error seeding staff data:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seeding function
seedStaffData();
