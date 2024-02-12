const express = require('express');
const { omit } = require('lodash');
const { v4: uuidv4 } = require('uuid');
const { prisma } = require('../config/prisma');
const Workflow = require('../core/Workflow');
const { convertFlow } = require('../helper/workflow');

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
router.post('/create', async(req,res) => {
  const body=req?.body
  console.log("🚀 ===== app.get ===== body:", body);
  const {name, description, nodes, edges, tableId}=body
  const workflow = await prisma.workflows.create({
    data:{
        name,
        description,
        edges,
        nodes,
        flows: convertFlow({
                nodes: body?.nodes,
                edges: body?.edges
            }),
        uuid: uuidv4(),
    //   ...omit(body,['tableId']),
    },
  })
  if(tableId){
    await prisma.table.update({
      where:{
        id: tableId,
      },
      data:{
        workflows:{
          connect: [
            {
              id:workflow?.id
            }
          ]
        }
      },
      include:{
        workflows:true
      }
    })
  }
  return res.json(workflow)
})
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
    const {name, description, nodes, edges, tableId}=body
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
            name,
            description,
            edges,
            nodes,
            flows: convertFlow({
                    nodes,
                    edges
                }),
        },
    });
    if (tableId) {
        await prisma.table.update({
            where: {
                id: tableId,
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
router.post('/:uuid/run', async(req,res) => {
    const body=req?.body
    const {uuid} = req?.params
    const workflow= await prisma.workflows.findFirst({
        where:{
            uuid
        }
    })
    console.log("🚀 ===== router.post ===== workflow:", workflow);
    const flows = workflow?.flows?.map((item) => ({
        ...item?.data,
        id: item?.id
    }))
    // const workflows = body.map((item) => ({
    //   ...item?.data,
    //   id: item?.id
    // }))
    await runWorkflows({
      uuid,
      workflows:flows,
    },res)
    return res.json({message:'connect oke'})
})
module.exports = router;
