const express = require('express');
const { omit } = require('lodash');
const { v4: uuidv4 } = require('uuid');
const {fork} = require('child_process')
const net = require('net')
const { prisma } = require('../config/prisma');
const Workflow = require('../core/Workflow');
const { convertFlow } = require('../helper/workflow');
const {  exportWorkflow } = require('../helper/export');

const router = express.Router();

const runWorkflows = async ({id, uuid, workflows, process_uuid },req, res) => {
    try{
    // setInterval(() => {
    //   req.app.get('socket').emit('test', new Date());
    // }, 1000)
    const childProcess = fork('./core/run_process.js')
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
    },req, res)
})
router.get('/:uuid/export', async (req, res) => {
    console.log('params', req.params);
    const { uuid } = req.params;
    const workflow = await prisma.workflows.findFirst({
        where: {
            uuid,
        },
    });
    const {nodes, edges} = workflow
    return exportWorkflow({type:'JSON', data: JSON.stringify({nodes, edges}), res})
});
router.post('/:uuid/duplicate', async (req, res) => {
    const { uuid } = req.params;
    const { name } = req.body;
    const workflow = await prisma.workflows.findFirst({
        where: {
            uuid,
        },
        include: {
            table: true,
        },
    });
    console.log("🚀 ===== router.post ===== workflow:", workflow);
    const {description, nodes, edges, flows, table} = workflow
    const duplicatedWorkflow = await prisma.workflows.create({
        data:{
            name,
            description,
            nodes,
            edges,
            flows,
            uuid: uuidv4(),
            user:{
                connect:{id: req?.user?.id}
            },
            ...(table && {
                table:{
                    connect:{id: table?.id }
                }
            })
        }
    })
    return res.json({message:"Duplicate successfully", uuid: duplicatedWorkflow?.uuid})
});
router.delete('/:uuid', async (req, res) => {
    try{
        const {uuid} = req.params
        const workflow = await prisma.workflows.findFirst({
            where:{
                uuid
            }
        })
        await prisma.workflows.update({
            where:{
                id: workflow?.id
            },
            data:{
                processes:{
                    deleteMany:{}
                }
            },
            include:{
                processes:true
            }
        })
        await prisma.workflows.deleteMany({
            where:{
                uuid
            }
        })
        return res.json({message:"Delete successfully"})
    }catch(error){
        console.log("🚀 ===== router.delete ===== error:", error);
        return res.status(500)
    }
})
module.exports = router;
