const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)){
            return res.status(400).json({ message: "Invalid status type: " + status })
        }

        //If there is an existing ConnectionRequest of same user,, 
        const existingConnectionRequest = await ConnectionRequest.findOne({
            fromUserId,
            toUserId,
        })

const connectionRequest = new ConnectionRequest({
    fromUserId,
    toUserId,
    status
})

const data = await connectionRequest.save();
res.json({
    message: "Connection request sent successfully",
    data,
});
    }
    catch (err) {
    res.status(400).send("ERROR: " + err.message)
}
})


module.exports = requestRouter;