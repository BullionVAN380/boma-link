require('dotenv').config();
const mongoose = require('mongoose');

// Define Job Schema
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    city: String,
    state: String,
    country: String,
    type: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      required: true
    }
  },
  requirements: [String],
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'executive'],
    required: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }]
}, {
  timestamps: true
});

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

// Define User Schema for reference
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createTestJobs() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('Please add your MONGODB_URI to .env.local');
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find an admin user to be the employer
    const employer = await User.findOne({ role: 'admin' });
    
    if (!employer) {
      console.error('No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    // Delete existing jobs
    await Job.deleteMany({});

    const jobs = [
      {
        title: 'Real Estate Agent',
        company: 'Affordable Housing Co.',
        description: 'We are looking for an experienced real estate agent to join our team. The ideal candidate will have a strong track record in residential property sales and excellent communication skills.',
        location: {
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          type: 'hybrid'
        },
        requirements: [
          'Valid real estate license',
          '2+ years of experience in residential sales',
          'Excellent communication and negotiation skills',
          'Strong knowledge of local property market'
        ],
        salary: {
          min: 50000,
          max: 100000,
          currency: 'USD'
        },
        employmentType: 'full-time',
        experienceLevel: 'mid',
        employer: employer._id,
        status: 'active'
      },
      {
        title: 'Property Manager',
        company: 'Affordable Housing Co.',
        description: 'Seeking a detail-oriented property manager to oversee our residential properties. Responsibilities include tenant relations, maintenance coordination, and financial reporting.',
        location: {
          city: 'Los Angeles',
          state: 'CA',
          country: 'USA',
          type: 'onsite'
        },
        requirements: [
          'Property management certification',
          '3+ years of property management experience',
          'Strong organizational and problem-solving skills',
          'Experience with property management software'
        ],
        salary: {
          min: 45000,
          max: 75000,
          currency: 'USD'
        },
        employmentType: 'full-time',
        experienceLevel: 'mid',
        employer: employer._id,
        status: 'active'
      },
      {
        title: 'Leasing Consultant',
        company: 'Affordable Housing Co.',
        description: 'Join our leasing team to help match residents with their perfect home. You will conduct property tours, process applications, and provide excellent customer service.',
        location: {
          city: 'New York',
          state: 'NY',
          country: 'USA',
          type: 'onsite'
        },
        requirements: [
          'High school diploma or equivalent',
          'Previous sales or customer service experience',
          'Strong interpersonal skills',
          'Availability to work weekends'
        ],
        salary: {
          min: 35000,
          max: 55000,
          currency: 'USD'
        },
        employmentType: 'full-time',
        experienceLevel: 'entry',
        employer: employer._id,
        status: 'active'
      }
    ];

    await Job.insertMany(jobs);
    console.log('Test jobs created successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error creating test jobs:', error);
    process.exit(1);
  }
}

createTestJobs();
