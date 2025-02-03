const express = require('express');
const Router = express.Router;
const courseRouter = Router();
const app = express();
const { courseModel } = require("../db");
const { purchaseModel } = require("../db");
const { userMiddleware } = require('../middleware/user');
courseRouter.use(express.json());

courseRouter.post('/purchase', userMiddleware, async (req, res)=>{
    const userId = req.userId;
    const courseId = req.body.courseId;

    await purchaseModel.create({
        userId,
        courseId
    })

    res.json({
        message: "You have successfully purchased the course"
    })
});

courseRouter.get('/preview', async (req, res)=>{
    const courses = await courseModel.find({});

    res.json({
        courses
    });
});

module.exports = {
    courseRouter: courseRouter
}