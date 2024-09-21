import mongoose from 'mongoose';

const AppliedJobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true
  },
  appliedCandidates: {
    type: [String],
    required: true
  }
}, { timestamps: true });

// Create the model with a new name
const JobApplication = mongoose.models.JobApplication || mongoose.model('JobApplication', AppliedJobSchema);

export default JobApplication;
