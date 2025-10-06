const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json()); // this is the middleware for changing req.body into json
app.use(cookieParser()); // this is middleware for read cookies

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
