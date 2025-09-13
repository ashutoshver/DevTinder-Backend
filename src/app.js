const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const validateSignupData = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")

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
      const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$1412");
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

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid token")
    }

    //validate the token
    const decodeMessage = await jwt.verify(token, "DEV@TINDER$1412"); //it provides id of user from which you login
    console.log(decodeMessage);

    const { _id } = decodeMessage;
    console.log(_id);

    //now from id, you just get prfile of user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }

    res.send(user)
  }
  catch (err) {
    res.status(400).send(err.message)
  }

})

//get user from email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail }); // get single user via email
    if (user?.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something wend wrong");
  }
});

//Feed api - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({}); //get all the users data
    res.send(users);
  } catch (err) { }
});

//Delete user api
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted succesfully");
  } catch (err) { }
});

//update data of the user
app.patch("/userDetails/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  console.log(data);

  try {
    const ALLOWD_UPDATES = ["gender", "photoUrl", "age", "about"];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWD_UPDATES.includes(key)
    );
    if (!isUpdateAllowed) {
      throw new Error("update not allowed");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Update failed:" + err.message);
  }
});

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
