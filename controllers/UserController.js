import UserProfile from "../model/userModel.js";

// Handle registration with Google
const HandleRegisterWithGoogle = async (req, res) => {
  const { email, uid, name, profile } = req.body;
  console.log(profile);
  try {
    // Check if the user already exists by UID
    const existingUser = await UserProfile.findOne({ uid });
    if (existingUser) {
      return res.status(200).send("User already exists");
    }

    // Create a new user
    const newUser = new UserProfile({
      name,
      email,
      uid,
      profileUrl: profile,
    });

    // Save the new user to the database
    await newUser.save();

    // Send success response
    res.status(200).send("User registered successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Handle registration with email and password
const HandleRegisterWithEmailAndPassword = async (req, res) => {
  const { email, uid, name } = req.body;

  try {
    // Check if the user already exists by email
    const existingUser = await UserProfile.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Hash the password
   

    // Create a new user
    const newUser = new UserProfile({
      name,
      email,
      uid, // Store the hashed password
    });

    // Save the new user to the database
    await newUser.save();

    // Send success response
    res.status(200).send("User registered successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
const handleSaveChanges = async (req, res) => {
  try {
    const data = req.body; // Extract the data from the request body
    console.log(data);

    // Update the user profile in the database
    const updatedUser = await UserProfile.findOneAndUpdate(
      { email: data.email }, // Match based on the email
      { $set: data }, // Update the fields with the new data
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Changes saved successfully",
      updatedUser, // Optionally return the updated user data
    });
  } catch (error) {
    console.error("Error occurred while saving changes:", error);
    res.status(500).json({
      message: "An error occurred while saving changes",
      error: error.message, // Optionally include the error message in the response
    });
  }
};
// Get user information by UID
const GetUserInfor = async (req, res) => {
  const { uid } = req.body;

  try {
    if (!uid) {
      return res.status(400).send("UID not present");
    }

    const user = await UserProfile.findOne({ uid });
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const handleProfileSubmit = async (req, res) => {
  try {
    const data = req.body;

    const updatedUser = await UserProfile.findOneAndUpdate(
      { email: data.email },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Successfully updated
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

  


// Exporting the functions
export {
  HandleRegisterWithGoogle,
  HandleRegisterWithEmailAndPassword,
  GetUserInfor,
  handleProfileSubmit,
  handleSaveChanges,
};
