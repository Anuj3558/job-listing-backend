import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  whoWeAreLookingFor: {
    type: String,
    required: true,
  },
  experienceRequirements: {
    type: [String],
    required: true,
  },
  jobFeatures: {
    type: [String],
    required: true,
  },
  educationRequirements: {
    type: [String],
    required: true,
  },
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Internship"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Draft", "Open", "Closed"],
    default: "Draft",
  },
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);

export default Job;
