const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ashutosheng1412_db_user:bEf90CU9CzrPwvBp@ashunode.n6gkzjd.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
