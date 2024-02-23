const { v4: uuidv4 } = require('uuid');
const { prisma } = require("../config/prisma")
const Workflow = require("./Workflow")

const start = process.hrtime()
process.on('message', async ({id, uuid, workflows, process_uuid})=> {
    console.log('pid', process.pid)
    const runningProcess=await prisma.process.create({
        data:{
            uuid: process_uuid,
            pid: process.pid.toString(),
            workflow:{
                connect:{id}
            },
            status:"RUNNING"
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
                status:"SUCCESS",
                duration: process.hrtime(start)[0]
            }
        })
        if(updatedProcess?.id){
            process.send({status:'SUCCESS' })
            process.exit()
        }

    }catch(error){
        console.log("🚀 ===== process.on ===== error:", error);
        await prisma.process.update({
            where:{
                id: runningProcess?.id
            },
            data:{
                status:"FAILED",
                duration: process.hrtime(start)[0]
            }
        })

    }
})
// process.on('message', (m, socket) => {
//   if (m === 'socket') {
//     if (socket) {
//         console.log('HAVE SOCKET')
//       // Check that the client socket exists.
//       // It is possible for the socket to be closed between the time it is
//       // sent and the time it is received in the child process.
//       socket.end(`Request handled with ${process.argv[2]} priority`);
//     }
//   }
// }); 