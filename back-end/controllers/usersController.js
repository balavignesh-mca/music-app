const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
//@desc Register a user
//@route POST /api/register
//@access public

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(409);

    throw new Error("user already registerd!");
  }

  //hash password 
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("hashed password: " + hashedPassword);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log(`user created ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data us not vaild");
  }
});

//@desc login user
//@route POST /api/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ statusCode: 400, error: "All fields are mandatory!" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ statusCode: 404, error: "Email not found." });
  }

  // Compare password with hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ statusCode: 401, error: "Password is not valid." });
  }

  try {
    // Generate and send the access token if both email and password are valid
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT // secret key
    );

    res.status(201).json({ statusCode: 201, accessToken });
    console.log(accessToken);
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const tokenVerify = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    console.log(id);
    const data = await User.findById(id);
    res.status(200).json(data);
  } catch (error) {
    // Handle errors here
    console.error("Error in token verification:", error);
    res.status(500).json({ Status: "Failure", Error: "Token verification failed" });
  }
});


const profileUpdate = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const {username,password} = req.body;
  let hashedPassword;
  try {
    if(password){
     hashedPassword = await bcrypt.hash(password,10)
    }
    const user = await User.findByIdAndUpdate(id, {username,hashedPassword}, { new: true });
    console.log(user);
    if (!user) {
      return res.status(404).json({ Status: "Failure", Error: "user not found" });
    }
    res.status(200).json({ Status: "Success", user });
  } catch (err) {
    res
      .status(500)
      .json({ Status: "Failure", Error: "Error in updating user data" });
  }
});

module.exports = { registerUser, loginUser, tokenVerify, profileUpdate };
