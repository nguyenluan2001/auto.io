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

router.get('/me',async(req,res) => {
    try{
        const user = await prisma.users.findUnique({
            where:{
                id: req?.user?.id
            }
        })
        console.log("🚀 ===== router.get ===== user:", user);
        if(!user?.id){
            return res.status(403).json({status:403, message:"Unauthorized"})
        }

        res.json({status:200, data:{
            id: user?.id,
            email: user?.email,
            username: user?.username
        }})
    }catch(error){
        console.log("🚀 ===== router.post ===== error:", error);
        return res.status(403).json({status:403, message:"Unauthorized"})
    }
})
module.exports = router;