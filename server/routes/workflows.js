const express = require('express');
const { omit } = require('lodash');
const { v4: uuidv4 } = require('uuid');
const {fork} = require('child_process')
const { prisma } = require('../config/prisma');
const Workflow = require('../core/Workflow');
const { convertFlow } = require('../helper/workflow');

const router = express.Router();

const runWorkflows = async ({id, uuid, workflows, process_uuid }, res) => {
    try{

    const childProcess = fork('./run.js')
    childProcess.send({id, uuid, workflows, process_uuid})
    childProcess.on('message', ({status}) => {
        if(status==='SUCCESS'){
            return res.json({message:"Run workflow successfully"})
        }
        return res.status(500).json({message:"Run workflow failed"})
    })
    // const workflow = new Workflow(uuid, workflows)
    // workflow.run()
    }catch(error){
        console.log('error',error)
    }

}
router.get('/', async (req, res) => {
    const workflows = await prisma.workflows.findMany({
        where:{
            user:{
                id: req?.user?.id
            }
        }
    });
    return res.json(workflows);
});
router.post('/create', async(req,res) => {
  const body=req?.body
  const {name, description, nodes, edges, tableId}=body
  console.log('user', req.user)
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
        user:{
            connect: { id: req?.user?.id }
        },
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
    const {process_uuid} = body
    const workflow= await prisma.workflows.findFirst({
        where:{
            uuid
        }
    })
    const flows = workflow?.flows?.map((item) => ({
        ...item?.data,
        id: item?.id
    }))
    await runWorkflows({
      uuid,
      id: workflow?.id,
      workflows:flows,
      process_uuid
    },res)
})
module.exports = router;
