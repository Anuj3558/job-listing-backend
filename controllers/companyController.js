import cloudinary from "../config/cloudinaryConfig.js";
import Company from "../model/CompanyModel.js";
import UserProfile from "../model/userModel.js";
import bcrypt from 'bcrypt';

const handleLoginToComapny = (req, res) => {
  // Implement the login functionality
};

const handleCompanyRegistration = async (req, res) => {
  try {
    const { name, address, email, uid, companyCode } = req.body;
    const logoUrl = req.file ? req.file.path : null;

    if (!name || !address || !email || !companyCode) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Hash the company code
    const saltRounds = 10;
    const hashedCompanyCode = await bcrypt.hash(companyCode, saltRounds);

    let imageUrl = "";
    if (req.file) {
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    // Save the company data to the database
    const newCompany = await Company.create({
      name,
      owner: uid,
      address,
      email,
      logoUrl: imageUrl,
      code: hashedCompanyCode, // Store the hashed company code
    });

    const user = await UserProfile.findOneAndUpdate(
      { uid: uid }, // Query: find the user with the given uid
      { $set: { userType: "company", status: "completed" } }, // Update operation: set userType to "company"
      { new: true } // Options: return the updated document
    );

    console.log(user);
    console.log('Company registered:', newCompany);

    res.status(201).json({ message: 'Company registered successfully', company: newCompany });
  } catch (error) {
    console.error('Error registering company:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
const getCompanyData = async (req, res) => {
    try {
      const { uid } = req.body;
  
      // Find the user profile by UID
      const user = await UserProfile.findOne({ uid: uid });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const email = user.email;
  
      // Find the company where the user is an admin
      const company = await Company.findOne({ admins: { $elemMatch: { email: email } } });
  
      // Find the company where the user is the owner
      const ownerCompany = await Company.findOne({ owner: uid });
  
      if (!company && !ownerCompany) {
        return res.status(404).json({ error: "No company found for this user" });
      }
  
      // Return the found company data
      return res.status(200).json({ company, ownerCompany });
    } catch (error) {
      console.error("Error fetching company data:", error);
      return res.status(500).json({ error: "Server error" });
    }
  };
  
export { handleCompanyRegistration, handleLoginToComapny,getCompanyData };
