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
            interval:parseInt(trigger?.interval, 10),
            delay:trigger?.delay,
            uuid:trigger?.uuid,
            type:trigger?.type,
            next_run: dayjs().add(trigger?.interval,'minutes'),
            is_active: trigger?.is_active
        }
    }
    if(trigger?.type==='CRON_JOB'){
        return {
            expression: trigger?.expression,
            uuid:trigger?.uuid,
            type:trigger?.type,
            next_run: new Date(parser.parseExpression(trigger?.expression).next().toString()),
            is_active: trigger?.is_active
        }
    }
    return {
            date: trigger?.date,
            uuid:trigger?.uuid,
            type:trigger?.type,
            next_run: trigger?.date,
            is_active: trigger?.is_active
    }
}
router.get('/', async(req,res) => {
    try{
        const schedules = await prisma.schedule.findMany({
            where:{
                user:{
                    id: req?.user?.id
                }
            },
            include:{
                user:true,
                triggers:true,
                workflow:true
            }
        })
        return res.json({schedules})
    }catch(error){
        console.log("🚀 ===== router.get ===== error:", error);
        return res.status(500).json({message:"Cancel running workflow failed"})
    }
})
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
        return res.json({createdSchedule})

    }catch(error){
        console.log("🚀 ===== router.get ===== error:", error);
        return res.status(500).json({message:"Cancel running workflow failed"})
    }
})
router.put('/:id', async(req,res) => {
    try{
        const {workflow, triggers, status} = req.body
        const {id} = req.params
        const updatedSchedule = await prisma.schedule.update({
            where:{
                id: parseInt(id, 10)
            },
            data:{
                status:status || 'ACTIVE',
                workflow:{
                    connect:{id: workflow?.id}
                },
            },
            include:{
                triggers:true,
                workflow:true
            }
        })
        for(const trigger of triggers) {
            await prisma.trigger.update({
                where:{
                    id: parseInt(trigger?.id, 10)
                },
                data:formatTrigger(trigger)
            })
        }
        
        return res.json({schedule: updatedSchedule, message:'Updated schedule successfully'})

    }catch(error){
        console.log("🚀 ===== router.get ===== error:", error);
        return res.status(500).json({message:"Cancel running workflow failed"})
    }
})
router.delete('/:id', async(req,res) => {
    try{
        const {id} = req.params
        await prisma.schedule.update({
            where:{
                id: parseInt(id, 10)
            },
            data:{
                triggers:{
                    deleteMany:{}
                }
            },
            include:{
                triggers:true
            }
        })
        await prisma.schedule.delete({
            where:{
                id: parseInt(id, 10)
            },
        })
        
        return res.json({ message:'Delete schedule successfully'})

    }catch(error){
        console.log("🚀 ===== router.get ===== error:", error);
        return res.status(500).json({message:"Cancel running workflow failed"})
    }
})
module.exports = router;
