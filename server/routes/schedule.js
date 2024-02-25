const express = require('express');
const { omit, get } = require('lodash');
const { v4: uuidv4 } = require('uuid');
const {fork} = require('child_process')
const dayjs = require('dayjs');
const parser = require('cron-parser')
const { prisma } = require('../config/prisma');
const Workflow = require('../core/Workflow');
const { convertFlow } = require('../helper/workflow');

const router = express.Router();

const formatTrigger= (trigger) => {
    if(trigger?.type==='INTERVAL') {
        return {
            interval:+trigger?.interval,
            delay:trigger?.delay,
            uuid:trigger?.uuid,
            type:trigger?.type,
            next_run: dayjs().add(trigger?.interval,'minutes')
        }
    }
    if(trigger?.type==='CRON_JOB'){
        return {
            expression: trigger?.expression,
            uuid:trigger?.uuid,
            type:trigger?.type,
            next_run: new Date(parser.parseExpression(trigger?.expression).next().toString())
        }
    }
    return {
            date: trigger?.date,
            uuid:trigger?.uuid,
            type:trigger?.type,
            next_run: trigger?.date,
    }
}
router.post('/', async(req,res) => {
    try{
        const body=req?.body
        const {workflow, triggers} = body
        console.log("🚀 ===== router.post ===== body:", body);
        const createdSchedule = await prisma.schedule.create({
            data:{
                status: "ACTIVE",
                uuid: uuidv4(),
                user:{
                    connect:{id:req?.user?.id}
                },
                workflow:{
                    connect:{id: workflow?.id}
                },
                triggers:{
                    create:triggers?.map((trigger) =>formatTrigger(trigger))
                }
            },
            include:{
                triggers:true,
                user:true,
                workflow:true
            }
        })
        // for(const trigger of triggers){
        //     await prisma.trigger.create({
        //         data:{
        //             ...trigger,
                    
        //         }
        //     })
        // }
        return res.json({createdSchedule})

    }catch(error){
        console.log("🚀 ===== router.get ===== error:", error);
        return res.status(500).json({message:"Cancel running workflow failed"})
    }
})
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
