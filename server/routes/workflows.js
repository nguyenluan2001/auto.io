const express = require('express');
const { omit } = require('lodash');
const { prisma } = require('../config/prisma');
const Workflow = require('../core/Workflow');

const router = express.Router();

const runWorkflows = async ({workflows, uuid}, res) => {
    try{

    console.log("🚀 ===== runWorkflows ===== workflows:", workflows);
    const workflow = new Workflow(uuid, workflows)
    workflow.run()
    }catch(error){
        console.log('error',error)
    }

}
router.get('/', async (req, res) => {
    const workflows = await prisma.workflows.findMany();
    return res.json(workflows);
});
router.get('/:uuid', async (req, res) => {
    console.log('params', req.params);
    const { uuid } = req.params;
    const workflow = await prisma.workflows.findFirst({
        where: {
            uuid,
        },
        include: {
            table: {
                include: {
                    columns: true,
                },
            },
        },
    });
    return res.json(workflow);
});
router.put('/:uuid', async (req, res) => {
    console.log('params', req.params);
    const { uuid } = req.params;
    console.log('🚀 ===== app.put ===== uuid:', uuid);
    const { body } = req;
    const workflow = await prisma.workflows.findFirst({
        where: {
            uuid,
        },
    });
    console.log('🚀 ===== app.put ===== workflow:', workflow);
    await prisma.workflows.updateMany({
        where: {
            uuid,
        },
        data: {
            ...omit(body, ['tableId']),
        },
    });
    if (body?.tableId) {
        await prisma.table.update({
            where: {
                id: body?.tableId,
            },
            data: {
                workflows: {
                    connect: [
                        {
                            id: workflow?.id,
                        },
                    ],
                },
            },
            include: {
                workflows: true,
            },
        });
    }
    return res.json(workflow);
});
router.post('/:uuid/run', (req,res) => {
    const body=req?.body
    const {uuid} = req?.params
    const workflows = body.map((item) => ({
      ...item?.data,
      id: item?.id
    }))
    runWorkflows({
      uuid,
      workflows
    },res)
    return res.json({message:'connect oke'})
})
module.exports = router;
