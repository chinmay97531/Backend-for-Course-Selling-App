const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt  = require('bcrypt');
const express = require('express');
const { JWT_Admin_SECRET } = require('../config');
const { z } = require("zod");
const adminRouter = Router();
const { adminModel } = require("../db");
const { courseModel } = require("../db");
const app = express();
const { adminMiddleware } = require('../middleware/admin');
adminRouter.use(express.json());


adminRouter.post('/signup', async (req, res)=>{

    const requiredBody = z.object({
        firstName: z.string().min(2).max(50),
        lastName: z.string().min(2).max(50),
        password: z.string().min(2).max(50),
        email: z.string().min(2).max(50).email()
    })
    const parsedDatawithSuccess = requiredBody.safeParse(req.body);

    if(!parsedDatawithSuccess.success){
        res.status(400).json({
            message: "Invalid Data"
        });
        return;
    }

    const { firstName, lastName, email, password } = parsedDatawithSuccess.data;

    try{
        const hashedpassword = await bcrypt.hash(password, 5);

        await adminModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedpassword
        })
    }
    catch(err){
        res.status(400).json({
            message: "Admin already exists"
        })
    }

    res.json({
        message: "Admin Created"
    })
})


adminRouter.post('/signin', async (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const admin = await adminModel.findOne({
        email: email
    });

    if(!admin){
        res.status(403).json({
            message: "Admin not found"
        });
        return;
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if(passwordMatch){
        const token = jwt.sign({
            id: admin._id.toString()
        }, JWT_Admin_SECRET);
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


adminRouter.post('/course', adminMiddleware, async (req, res)=>{
    const adminId = req.userId;

    const { title, description, price, imageUrl } = req.body;

    const course = await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: adminId
    });

    res.json({
        message: "Course Created", 
        courseId: course._id
    })
})

adminRouter.put('/course', adminMiddleware, async (req, res)=>{
    const adminId = req.userId;

    const { title, description, price, imageUrl, courseId } = req.body;

    const course = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    }, {
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
    });

    res.json({
        message: "Course Created", 
        courseId: course._id
    })
})

adminRouter.get('/course/bulk', adminMiddleware, async (req, res)=>{
    const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId: adminId
    });

    if(courses.length >= 1){
        res.json({
            message: courses
        })
    }
    else{
        res.json({
            message: "No Course found"
        });
    }
})

module.exports = {
    adminRouter: adminRouter
}