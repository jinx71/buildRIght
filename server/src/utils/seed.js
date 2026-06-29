/* Seed the database with an admin user and a portfolio of projects.
 * Run from the server folder: `npm run seed`
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');

const projects = [
  {
    title: 'Quayside Mixed-Use Development',
    category: 'commercial',
    location: 'Dublin 2',
    year: 2022,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80',
    description: 'A six-storey office and retail building on the docklands, delivered on a fast-track programme.',
    featured: true,
  },
  {
    title: 'Seapoint Family Home',
    category: 'residential',
    location: 'Blackrock, Co. Dublin',
    year: 2022,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80',
    description: 'A detached, A-rated four-bedroom home with passive-house principles throughout.',
    featured: true,
  },
  {
    title: 'Ballymount Logistics Hub',
    category: 'industrial',
    location: 'Dublin 12',
    year: 2021,
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900&q=80',
    description: 'A 9,000 m² steel-frame warehouse with an integrated office mezzanine.',
    featured: false,
  },
  {
    title: 'Fitzwilliam Office Refurbishment',
    category: 'renovation',
    location: 'Dublin 2',
    year: 2022,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80',
    description: 'A full Georgian-floor refurbishment with accessibility and services upgrades.',
    featured: true,
  },
  {
    title: 'Swords Manufacturing Facility',
    category: 'industrial',
    location: 'Swords, Co. Dublin',
    year: 2021,
    image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=900&q=80',
    description: 'Phase-one of a precision manufacturing plant for a life-sciences client.',
    featured: false,
  },
  {
    title: 'South William Retail Fit-Out',
    category: 'commercial',
    location: 'Dublin 2',
    year: 2021,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80',
    description: 'A heritage façade restoration paired with a contemporary ground-floor retail fit-out.',
    featured: false,
  },
  {
    title: 'Howth Coastal Renovation',
    category: 'renovation',
    location: 'Howth, Co. Dublin',
    year: 2022,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=80',
    description: 'A storm-resilient extension and re-roof for a clifftop property.',
    featured: false,
  },
  {
    title: 'Clontarf Townhouses',
    category: 'residential',
    location: 'Dublin 3',
    year: 2022,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80',
    description: 'A terrace of five energy-efficient townhouses on an infill site.',
    featured: false,
  },
];

const run = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Project.deleteMany({});

    await User.create({
      name: process.env.ADMIN_NAME || 'Site Admin',
      email: process.env.ADMIN_EMAIL || 'admin@buildright.dev',
      password: process.env.ADMIN_PASSWORD || 'admin12345',
      role: 'admin',
    });

    await Project.insertMany(projects);

    // eslint-disable-next-line no-console
    console.log('✅ Seed complete:');
    // eslint-disable-next-line no-console
    console.log(`   • admin: ${process.env.ADMIN_EMAIL || 'admin@buildright.dev'} / ${process.env.ADMIN_PASSWORD || 'admin12345'}`);
    // eslint-disable-next-line no-console
    console.log(`   • projects: ${projects.length}`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

run();
