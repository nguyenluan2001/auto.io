const express = require('express');
const { omit, get } = require('lodash');
const { v4: uuidv4 } = require('uuid');
const {fork} = require('child_process')
const dayjs = require('dayjs');
const { prisma } = require('../config/prisma');
const Workflow = require('../core/Workflow');
const { convertFlow } = require('../helper/workflow');
const { generateAuthUrl } = require('../utils/google');

const router = express.Router();

router.get('/:provider/connect', async(req,res) => {
    try{
        console.log('req', req.params)
        const {provider} = req.params
        if(provider==='google-drive'){
            const url = generateAuthUrl({
                userId: req?.user?.id
            })
            return res.json({status:200,url})
        }
    }catch(error){
        console.log("🚀 ===== router.get ===== error:", error);
        return res.status(500).json({message:"Cancel running workflow failed"})
    }
})
module.exports = router;
