require('dotenv').config()

const express = require('express');
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function main() {
    mongoose.connect(process.env.MongoDB_URL);
    app.listen(port, ()=>{
        console.log(`Port listening on ${port}`)
    });
}

main();