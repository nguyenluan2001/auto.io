const express = require('express');
const { omit } = require('lodash');
const { v4: uuidv4 } = require('uuid');
const {fork} = require('child_process')
const { prisma } = require('../config/prisma');
const Workflow = require('../core/Workflow');
const { convertFlow } = require('../helper/workflow');

const router = express.Router();

router.get('/:uuid/cancel', async(req,res) => {
    try{
        const body=req?.body
        const {uuid} = req?.params
        console.log("🚀 ===== router.get ===== uuid:", uuid);
        const runningProcess=await prisma.process.findFirst({
            where:{
                uuid,
                status: 'RUNNING'
            },
            orderBy: {
                id: 'desc',
            },
        })
        console.log("🚀 ===== router.get ===== runningProcess:", runningProcess);
        process.kill(parseInt(runningProcess?.pid, 10), 9)
        await prisma.process.update({
            where:{
                id: runningProcess?.id
            },
            data:{
                status:"CANCELED"
            }
        })
        return res.json({message:'Cancel running workflow successfully'})

    }catch(error){
        console.log("🚀 ===== router.get ===== error:", error);
        return res.status(500).json({message:"Cancel running workflow failed"})
    }
})
module.exports = router;
