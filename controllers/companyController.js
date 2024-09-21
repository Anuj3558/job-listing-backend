import cloudinary from "../config/cloudinaryConfig.js";
import userAppliedJob from "../model/appliedJobs.js";
import Company from "../model/CompanyModel.js";
import Job from "../model/JobModel.js";
import JobApplication from "../model/JobsApplied.js";
import AppliedJob from "../model/JobsApplied.js";
import UserProfile from "../model/userModel.js";
import bcrypt from 'bcrypt';

const handleLoginToCompany = async (req, res) => {
    const { uid, companyCode1 } = req.body;
  
    if (uid && companyCode1) {
      try {
        // Find the user by uid
        const user = await UserProfile.findOne({ uid: uid });
        if (user) {
          const userEmail = user.email;
  
          
          // Find the company by its code
          const company = await Company.findOne({ code: companyCode1 });
          if (company) {
            // Check if the user's email is already an admin
            if (!company.admins.includes(userEmail)) {
              // Add the user's email to the admins array
              company.admins.push(userEmail);
              await company.save(); // Save the updated company document
              const updatedUser = await UserProfile.updateOne(
                { uid: uid },
                { $set: { userType: "company" } }
              );
              

              res.status(200).send({ message: "User added as admin", company });
            } else {
             
              res.status(200).send({ message: "User is already an admin", company });
            }
          } else {

            res.status(404).send({ message: "Company not found" });
          }
        } else {
         
          res.status(404).send({ message: "User not found" });
        }
      } catch (error) {
        console.error("Error in handleLoginToCompany:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    } else {
      res.status(400).send({ message: "Invalid request" });
    }
  };
const handleCompanyRegistration = async (req, res) => {
  try {
    const { name, address, email, uid, companyCode } = req.body;
    const logoUrl = req.file ? req.file.path : null;

    if (!name || !address || !email || !companyCode) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Hash the company code
  
    const hashedCompanyCode = companyCode;

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

 

    res.status(201).json({ message: 'Company registered successfully', company: newCompany });
  } catch (error) {
    console.error('Error registering company:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
const getAllJobs =async(req,res)=>{
  try {


    // Find jobs by company name
    const jobs = await Job.find();
   

    // Check if jobs were found
    if (jobs.length === 0) {
      return res.status(200).json({
        message: "No jobs found for the specified company",
      });
    }

    // Respond with the found jobs
    res.status(200).json({
      message: "Jobs retrieved successfully",
      jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      message: "An error occurred while fetching jobs",
      error: error.message,
    });
  }
}
const getCompanyData = async (req, res) => {
    try {
      const { uid } = req.body;
  
      // Find the user profile by UID
      const user = await UserProfile.findOne({ uid: uid });
      if (!user) {
        return res.status(200).json({ error: "User not found" });
      }
  
      const email = user.email;
      const company = await Company.findOne({ admins: email });
   
      // Find the company where the user is an admin

      // Find the company where the user is the owner
      const ownerCompany = await Company.findOne({ owner: uid });
  
      if (!company && !ownerCompany) {
        return res.status(200).json({ error: "No company found for this user" });
      }
  
      // Return the found company data
      return res.status(200).json({ company, ownerCompany });
    } catch (error) {
      console.error("Error fetching company data:", error);
      return res.status(500).json({ error: "Server error" });
    }
  };
  const HandleJobPost = async (req, res) => {
    try {
      const {
        title, // Job title
        Companyname
, // Company name
        location,
        salary,
        description,
        whoWeAreLookingFor,
        experienceRequirements,
        jobFeatures,
        educationRequirements,
        jobType, // Company name
      } = req.body;
       const fetchedCompany=await Company.find({name:Companyname})

       const url = fetchedCompany[0].logoUrl;
     
      // Find the job with the given title and company
      let job = await Job.findOne({ title, Companyname
      });
  
      if (job) {
        // Update the job status to "Open"
        job.status = "Open";
  
        // Save the updated job to the database
        await job.save();
  
     
  
        // Respond with the updated job and a success message
        res.status(201).json({
          message: "Job status updated to open successfully.",
          job,
        });
      } else {
        job = new Job({
            title,
            company:Companyname,
            location,
            salary,
            description,
            ProfileUrl:url,
            whoWeAreLookingFor,
            experienceRequirements,
            jobFeatures,
            educationRequirements,
            jobType,
            status: "Open", // Explicitly setting the status to "Draft"
          });
          await job.save();
        // If the job does not exist, respond with an error message
        res.status(201).json({
          message: "Job not found.",
        });
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      res.status(500).json({
        message: "An error occurred while updating the job status.",
        error: error.message,
      });
    }
  };

// Assuming your Job model is in the models directory
const getJobs =async (req, res) => {
    try {
      const { companyname } = req.query; // Get companyname from query parameters
      

      if (!companyname) {
        return res.status(200).json({
          message: "Company name is required",
        });
      }
  
      // Find jobs by company name
      const jobs = await Job.find({ company: companyname });

  
      // Check if jobs were found
      if (jobs.length === 0) {
        return res.status(200).json({
          message: "No jobs found for the specified company",
        });
      }
  
      // Respond with the found jobs
      res.status(200).json({
        message: "Jobs retrieved successfully",
        jobs,
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({
        message: "An error occurred while fetching jobs",
        error: error.message,
      });
    }
  };
const SaveDraft = async (req, res) => {
    try {
      const {
        title, // Job title
        Companyname, // Company name
        location,
        salary,
        description,
        whoWeAreLookingFor,
        experienceRequirements,
        jobFeatures,
        educationRequirements,
        jobType,
      } = req.body;
  
      
  
      // Check if a job with the given title and company already exists
      let job = await Job.findOne({ title, Companyname });
      const fetchedCompany=await Company.find({name:Companyname})
     
      const url = fetchedCompany[0].logoUrl;
      
     
      if (job) {
        // Update the existing job with new values
        job.location = location;
        job.salary = salary;
        job.description = description;
        job.whoWeAreLookingFor = whoWeAreLookingFor;
        job.experienceRequirements = experienceRequirements;
        job.jobFeatures = jobFeatures;
        job.educationRequirements = educationRequirements;
        job.jobType = jobType;
        job.status = "Draft"; // Ensure status is set to "Draft"
  
        // Save the updated job to the database
        await job.save();
  
    
  
        // Respond with the updated job and a success message
        res.status(201).json({
          message: "Job updated as draft successfully.",
          job,
        });
      } else {
        // Create a new job with the provided data and set status to "Draft"
        job = new Job({
          title,
          company:Companyname,
          location,
          salary,
          ProfileUrl:url,
          description,
          whoWeAreLookingFor,
          experienceRequirements,
          jobFeatures,
          educationRequirements,
          jobType,
          status: "Draft", // Explicitly setting the status to "Draft"
        });
  
        // Save the job to the database
        await job.save();
  
  
        // Respond with the saved job and a success message
        res.status(201).json({
          message: "Job saved as draft successfully.",
          job,
        });
      }
    } catch (error) {
      console.error("Error saving job as draft:", error);
      res.status(500).json({
        message: "An error occurred while saving the job as a draft.",
        error: error.message,
      });
    }
  };


  const closePosition = async (req, res) => {
  
  
    const { jobId } = req.body;
   
  
    try {
      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        { status: "Closed" },
        { new: true }
      );
  
      if (!updatedJob) {
        return res.status(404).json({ message: "Job not found" });
      }
  
      
      res
        .status(200)
        .json({ message: "Position closed successfully", job: updatedJob });
    } catch (error) {
      console.error("Error closing the position:", error);
      res
        .status(500)
        .json({ message: "An error occurred while closing the position" });
    }
  };
 // Adjust path based on your project structure

 // Updated model name

 const handleApplyJobs = async (req, res) => {
   const { jobId, uid } = req.body;
 
   try {
     // Check if the user has already applied for this job in userAppliedJob
     const userApplied = await userAppliedJob.findOne({ userId: uid, 'appliedJobs.jobId': jobId });
 
     if (userApplied) {
       return res.status(200).json({ message: "User has already applied for this job." });
     }
 
     // If the user hasn't applied, create or update their applied jobs in userAppliedJob
     let appliedJobRecord = await userAppliedJob.findOne({ userId: uid });
 
     if (!appliedJobRecord) {
       appliedJobRecord = new userAppliedJob({
         userId: uid,
         appliedJobs: [{ jobId, appliedDate: new Date(), appliedStatus: 'pending' }],
       });
     } else {
       appliedJobRecord.appliedJobs.push({ jobId, appliedDate: new Date(), appliedStatus: 'pending' });
     }
 
     await appliedJobRecord.save();
 
     // Save the job application in JobApplication schema
     let jobApplicationRecord = await JobApplication.findOne({ jobId });
 
     if (!jobApplicationRecord) {
       jobApplicationRecord = new JobApplication({
         jobId,
         appliedCandidates: [uid], // Add the first candidate
       });
     } else {
       jobApplicationRecord.appliedCandidates.push(uid);
     }
 
     await jobApplicationRecord.save();
 
     return res.status(200).json({ message: "Job application successful." });
   } catch (error) {
     console.error("Error applying for job:", error);
     return res.status(500).json({ message: "Server error, please try again later." });
   }
 };
 
 const UserJobAnalytics = async (req, res) => {
  const { uid } = req.body; // Assuming user ID is passed in the request body

try {
  // Find the user's applied jobs
  const appliedJobsData = await userAppliedJob.findOne({ userId: uid });

  if (!appliedJobsData || !appliedJobsData.appliedJobs.length) {
    return res.status(404).json({ message: "No applied jobs found for this user." });
  }

  // Map through the applied jobs and fetch job details
  const appliedJobDetails = await Promise.all(
    appliedJobsData.appliedJobs.map(async (job) => {
      const jobDetails = await Job.findById(job.jobId);
      return {
        title: jobDetails.title,
        company: jobDetails.company,
        location: jobDetails.location,
        appliedDate: job.appliedDate,
        appliedStatus: job.appliedStatus,
      };
    })
  );
  console.log(appliedJobDetails)
  // Return the applied jobs in the response
  return res.status(200).json({
    totalAppliedJobs: appliedJobDetails.length,
    appliedJobs: appliedJobDetails,
  });
} catch (error) {
  console.error(error);
  return res.status(500).json({ message: "Server error. Please try again later." });
}
 }
export { UserJobAnalytics,getAllJobs,getJobs,SaveDraft,handleCompanyRegistration, handleLoginToCompany,getCompanyData,HandleJobPost,closePosition,handleApplyJobs };
