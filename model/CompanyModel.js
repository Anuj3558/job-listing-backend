import mongoose from "mongoose";
import { Schema } from "mongoose";
// Define the schema for a company
const companySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  logoUrl:{
    type:String
  },
  code:{
    type:String
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
  },
  admins:[{
    type:String
  }]
});

// Create the model from the schema and export it
const Company = mongoose.model('Company', companySchema);

export default Company;
