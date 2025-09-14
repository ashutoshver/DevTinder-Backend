const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        //Read the token from req cookies
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Invalid token")
        }
        //validate the token
        const decodeObj = await jwt.verify(token, "DEV@TINDER$1412");
        const _id = decodeObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User does not exist");
        }
        req.user = user; //send user in req body
        next();
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
}

module.exports = { userAuth }