import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Experience schema
const ExperienceSchema = new Schema({
  company: { type: String },
  role: { type: String },
  duration: { type: String },
});

// Define the UserProfile schema
const UserProfileSchema = new Schema({
  uid:{type:String},
  name: { type: String },
  title: { type: String },
  location: { type: String },
  email: { type: String, unique: true },
  phone: { type: String },
  profileUrl:{type:String},
  education: [{ type: String }],
  certifications: [{ type: String }],
  experience: [ExperienceSchema],
  skills: { type: String },
  status:{default:"Pending" ,type:String}
});

// Create the UserProfile model
const UserProfile = mongoose.model('UserProfile', UserProfileSchema);

export default UserProfile;
