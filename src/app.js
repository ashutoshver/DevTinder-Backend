const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const validateSignupData = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json()); // this is the middleware for changing req.body into json
app.use(cookieParser()); // this is middleware for read cookies

app.post("/signup", async (req, res) => {
  console.log(req.body);

  try {
    //validation of data
    validateSignupData(req);

    //Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    //Creating a new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//login api
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId }); //get email from database and compare login email
    if (!user) {
      throw new Error("Email id is not registered");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //crate a JWT token
      const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$1412", {expiresIn: "12h"});
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    
    res.send(user)
  }
  catch (err) {
    res.status(400).send(err.message)
  }

})


connectDB()
  .then(() => {
    console.log("Databse connected Successfully");
    app.listen(3001, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected");
  });
