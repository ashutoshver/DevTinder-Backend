const express = require("express")

const app = express();

app.use("/test", (req, res) => { //Request Handler
    res.send("Request Handler Successful");
})

app.listen(3001, () => {
    console.log("Server is running");
    
})