const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
app.use(express.json()); // this is the middleware for changing req.body into json

app.post("/signup", async (req, res) => {
  const userObj = req.body;

  //Creating a new instance of user model
  const user = new User(userObj);
  await user.save();
  res.send("User added successfully");
});

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
  } catch (err) {}
});

//Delete user api
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted succesfully");
  } catch (err) {}
});

//update data of the user
app.patch("/userDetails", async (req, res) => {
  const userId = req.body.userId
  const data = req.body;
  try{
    const user = await User.findByIdAndUpdate(userId, data,{
      returnDocument: "after",
      runValidators: true
    })
    res.send("User updated successfully")
  }
  catch(err){

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
