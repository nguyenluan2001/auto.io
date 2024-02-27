const express = require('express');
const { omit, get } = require('lodash');
const { v4: uuidv4 } = require('uuid');
const {fork} = require('child_process')
const dayjs = require('dayjs');
const { prisma } = require('../config/prisma');
const Workflow = require('../core/Workflow');
const { convertFlow } = require('../helper/workflow');

const router = express.Router();

router.post('/', async(req,res) => {
    try{
        const body=req?.body
        const processes=await prisma.process.findMany({
            ...body,
            include:{
                workflow:true
            }
        })
        const totalPages = await prisma.process.count({
            ...omit(body, ['skip','take'])
        })
        return res.json({processes, meta: {
            totalPages: Math.ceil(totalPages/get(body, 'take'))
        }})

    }catch(error){
        console.log("🚀 ===== router.get ===== error:", error);
        return res.status(500).json({message:"Cancel running workflow failed"})
    }
})
router.get('/:uuid/cancel', async(req,res) => {
    try{
        const {uuid} = req.params
        const runningProcess=await prisma.process.findFirst({
            where:{
                uuid,
                status: 'RUNNING'
            },
            orderBy: {
                id: 'desc',
            },
        })
        process.kill(parseInt(runningProcess?.pid, 10), 9)
        const now = dayjs()
        const createdAt = dayjs(runningProcess?.createdAt)
        await prisma.process.update({
            where:{
                id: runningProcess?.id
            },
            data:{
                status:"CANCELED",
                duration: now.diff(createdAt,'second')
            }
        })
        return res.json({message:'Cancel running workflow successfully'})

    }catch(error){
        console.log("🚀 ===== router.get ===== error:", error);
        return res.status(500).json({message:"Cancel running workflow failed"})
    }
})
module.exports = router;
