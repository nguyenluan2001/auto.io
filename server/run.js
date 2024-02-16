const { v4: uuidv4 } = require('uuid');
const { prisma } = require("./config/prisma")
const Workflow = require("./core/Workflow")

process.on('message', async ({id, uuid, workflows, process_uuid})=> {
    console.log('pid', process.pid)
    const runningProcess=await prisma.process.create({
        data:{
            uuid: process_uuid,
            pid: process.pid.toString(),
            workflow:{
                connect:{id}
            }
        }
    })
    try{
        const workflow = new Workflow(uuid, workflows)
        await workflow.run()
        const updatedProcess = await prisma.process.update({
            where:{
                id: runningProcess?.id
            },
            data:{
                status:"SUCCESS"
            }
        })
        if(updatedProcess?.id){
            process.send({status:'SUCCESS'})
            process.exit()
        }

    }catch(error){
        console.log("🚀 ===== process.on ===== error:", error);
        await prisma.process.update({
            where:{
                id: runningProcess?.id
            },
            data:{
                status:"FAILED"
            }
        })

    }
})