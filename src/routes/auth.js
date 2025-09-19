const express = require("express");
const authRouter = express.Router();

const validateSignupData = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");


//signup api
authRouter.post("/signup", async (req, res) => {
    try {
        //validation of data
        validateSignupData(req);

        //Encrypt the password
        const { firstName, lastName, emailId, password, age, gender } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        //Creating a new instance of user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            age,
            gender
        });
        await user.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(400).send(err.message);
    }
});

//login api
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId }); //get email from database and compare login email
    if (!user) {
      throw new Error("Email id is not registered");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //crate a JWT token
      const token = await user.getJWT();
      //Add the token to cookies and send the response back to user
      res.cookie("token", token);
      res.send("Login successful");
    } else {
      throw new Error("Password is not valid");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now())
  });
  res.send("Logout Successful");
})

module.exports = authRouter;