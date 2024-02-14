const express = require('express');
const { omit } = require('lodash');
const qs = require('qs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { prisma } = require('../config/prisma');
const {parseQuery} = require('../helper/request')
const {JWT_SECRET_KEY} = require('../utils/constants')

const router = express.Router();

const ROWS_PER_PAGE=10
const saltRound =10

router.post('/sign-up',async(req,res) => {
    try{
        const body=req?.body
        const {email, password} = body
        const user = await prisma.users.findFirst({
            where:{
                email
            }
        })
        if(user?.id){
            return res.json({status:500, message:"Email is already existed"})
        }
        const hashedPassword = await bcrypt.hash(password, saltRound)
        const newUser = await prisma.users.create({
            data:{
                email,
                password: hashedPassword,
                provider:'local'
            }
        })

        const token = jwt.sign({
            id: newUser?.id
        }, JWT_SECRET_KEY, {
            expiresIn:'2 days'
        })
        res.json({status:200, data:{
            id: newUser?.id,
            email: newUser?.email,
            token
        }})
    }catch(error){
        console.log("🚀 ===== router.post ===== error:", error);
    }
})
router.post('/sign-in',async(req,res) => {
    try{
        const body=req?.body
        const {email, password} = body
        const user = await prisma.users.findFirst({
            where:{
                email
            }
        })
        console.log("🚀 ===== router.post ===== user:", user);
        if(!user){
            return res.status(500).json({status:500, message:"Email or password is not correct"})
        }
        const isCorrectPassword = await bcrypt.compare(password, user?.password)
        if(!isCorrectPassword){
            return res.status(500).json({status:500, message:"Email or password is not correct"})
        }
        const token = jwt.sign({
            id: user?.id
        }, JWT_SECRET_KEY, {
            expiresIn:'2 days'
        })
        res.json({status:200, data:{
            id: user?.id,
            email: user?.email,
            token
        }})
    }catch(error){
        console.log("🚀 ===== router.post ===== error:", error);
    }
})
module.exports = router;