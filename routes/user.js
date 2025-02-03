const express = require('express');
const Router = express.Router;
const userRouter = Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { JWT_User_SECRET } = require('../config');
const { z } = require("zod");

const { userModel, courseModel, purchaseModel } = require("../db");
const { userMiddleware } = require('../middleware/user');

const app = express();
userRouter.use(express.json());

userRouter.post('/signup', async (req, res)=>{
    const requiredBody = z.object({
        firstName: z.string().min(2).max(50),
        password: z.string().min(3).max(50),
        lastName: z.string().min(2).max(50),
        email: z.string().min(3).max(50).email(),
    })
    const parsedDatawithSuccess = requiredBody.safeParse(req.body);

    if(!parsedDatawithSuccess.success){
        console.log('Validation Errors:', parsedDatawithSuccess.error.errors);
        res.status(400).json({
            message : "Invalid Data",
            errors: parsedDatawithSuccess.error.errors
        });
        return
    }

    const { firstName, lastName, password, email } = parsedDatawithSuccess.data;

    try{
        const hashedpassword = await bcrypt.hash(password,5);

        await userModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedpassword
        })
    }
    catch(err){
        res.status(400).json({
            message: "User already exists"
        });
        return;
    }
    res.json({
        message: "User created"
    })
})


userRouter.post('/signin', async (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const user = await userModel.findOne({
        email: email
    });

    if(!user){
        res.status(403).json({
            message: "User not found"
        });
        return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(passwordMatch){
        const token = jwt.sign({
            id: user._id.toString()
        }, JWT_User_SECRET);
        res.json({
            token: token
        });
    }
    else{
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
})


userRouter.get('/purchase', userMiddleware, async (req, res)=>{
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    })

    const coursesData = await courseModel.find({
        _id: { $in: purchases.map(x=>x.courseId) }
    })

    res.json({
        purchases,
        coursesData
    })
})

module.exports = {
    userRouter: userRouter
}