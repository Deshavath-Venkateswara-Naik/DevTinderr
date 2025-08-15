const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,              // Prevent JavaScript access
  secure: isProd,              // Only send over HTTPS in production
  sameSite: "none",            // Required for cross-domain cookies (Vercel <-> Render)
  expires: new Date(Date.now() + 8 * 3600000), // Keep your existing 8-hour expiry
};

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    //   Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    // ✅ Set cookie for signup
    res.cookie("token", token, cookieOptions);

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      // ✅ Use cookieOptions for login
      res.cookie("token", token, cookieOptions);
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  // ✅ Update logout cookie to expire immediately cross-domain
  res.cookie("token", null, {
    httpOnly: true,
    secure: isProd,           
    sameSite: "none",
    expires: new Date(0),
  });
  res.send("Logout Successful!!");
});

module.exports = authRouter;
