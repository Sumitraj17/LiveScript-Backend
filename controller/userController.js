import User from "../models/userModel.js";
import { hashPassword, verifyPassword } from "../utils/passwordHash.js";
import jwt from "jsonwebtoken";

const userSignup = async (req, res) => {
  // Read the data from the request body
  const { userName, email, password } = req.body; // Validate input

  if (!userName || !email || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid Credentials" });
  }

  try {
    // Check if the user already exists
    const isUser = await User.findOne({
      $or: [{ userName }, { email }],
    }); // If user exists, return error

    if (isUser) {
      return res
        .status(400)
        .json({ status: "error", message: "UserName or Email already exists" });
    } // Hash the password before storing

    const hashedPassword = await hashPassword(password); // Create a new user

    const user = new User({
      userName,
      email,
      password: hashedPassword,
    }); // Save the user to the database

    await user.save(); // Generate access and refresh tokens (you'll need to implement token generation) // Example: const accessToken = generateAccessToken(user); // Set tokens in response/cookies as required // Send success response

    return res
      .status(201)
      .json({ status: "success", message: "User Registered Successfully" });
  } catch (error) {
    // Handle any internal errors
    console.error(error);
    return res
      .status(500)
      .json({ status: "Internal Error", message: "Something went wrong" });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  // const {accessToken}  = req.accessToken;
  // console.log(accessToken)
  console.log(req.cookies.accesstoken);

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "Email and password are required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ status: "error", message: "User not found" });
  }
  const isMatch = await verifyPassword(user.password, password);

  if (!isMatch) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid password" });
  }
  // const id =user._id
  const token = await jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:"7d"});
  res.cookie("accessToken",token,{httpOnly:true});
  user.refreshToken=token;
  await user.save()
  return res
  .status(200)
  .json({
    status:'Success',
    message:'User LogIn successful'
  })
};
const userLogout = async (req, res) => {
  const user = req.user;
  await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res.status(200).clearCookie("accesstoken", options).json({
    status: "Success",
    message: "Logout successful",
  });
};
export { userSignup, userLogin, userLogout };
