import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserAppliedJobSchema = new Schema({
  userId: {
   type:String,
    required: true,
  },
  appliedJobs: [
    {
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
      },
      appliedDate: {
        type: Date,
        default: Date.now,
      },
      appliedStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
    },
  ],
});

const userAppliedJob = mongoose.model('AppliedJob', UserAppliedJobSchema);
export default userAppliedJob;
