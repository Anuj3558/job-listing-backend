const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Company Schema (nested within Job Schema)
const companySchema = new Schema({
  name: { type: String, required: true },
  profileUrl: { type: String, required: false },
  location: { type: String, required: true },
});

// Job Schema
const jobSchema = new Schema({
  jobTitle: { type: String, required: true },
  company: { type: companySchema, required: true },
  jobType: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], required: true },
  location: { type: String, required: true },
  salaryRange: { type: String, required: true },
  description: { type: String, required: true },
  experienceRequirements: [{ type: String, required: true }],
  educationRequirements: [{ type: String, required: true }],
  jobFeatures: [{ type: String, required: true }],
  categories: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
