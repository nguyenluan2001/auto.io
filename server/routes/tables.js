const express = require('express');
const { omit } = require('lodash');
const { prisma } = require('../config/prisma');

const router = express.Router();

router.post('/',async(req,res) => {
  const body=req?.body
  const response = await prisma.table.create({
    data:{
      name:body?.name,
      columns:{
        create: body?.columns
      }
    },
    include:{
      columns:true
    }

  })
  console.log("🚀 ===== router.post ===== response:", response);
  res.json({message:'connect oke'})
  console.log("🚀 ===== router.post ===== body:", body);
})
router.get('/',async(req,res) => {
  try{
    const tables = await prisma.table.findMany({
      include:{
        columns:true
      }
    })
    res.status(200).json({tables})
  }catch(error){
    console.log("🚀 ===== router.get ===== error:", error);
    res.status(500).json({message:'Error'})
  }
})
router.get('/:id',async(req,res) => {
  try{
    const {id}=req.params
    const table = await prisma.table.findUnique({
      where:{
        id:parseInt(id,10)
      },
      include:{
        columns:true,
        rows:true
      }
    })
    res.status(200).json(table)
  }catch(error){
    console.log("🚀 ===== router.get ===== error:", error);
    res.status(500).json({message:'Error'})
  }
})
router.put('/:id',async(req,res) => {
  try{
    const body=req?.body
    const {id}=req.params
    await prisma.column.deleteMany({
      where:{
        tableId: parseInt(id,10),
      }
    })
    const table = await prisma.table.update({
      where:{
        id:parseInt(id,10)
      },
      data:{
        name: body?.name,
        columns:{
          create: body?.columns?.map((item) => omit(item,['id','tableId'])),
        }
      }
    })
    res.status(200).json(table)
  }catch(error){
    console.log("🚀 ===== router.get ===== error:", error);
    res.status(500).json({message:'Error'})
  }
})
router.delete('/:id',async(req,res) => {
  try{
    const {id}=req.params
    //  await prisma.table.delete({
    //   where:{
    //     id: parseInt(id,10)
    //   }
    // })
    const deleteColumns = prisma.column.deleteMany({
      where: {
        tableId: parseInt(id,10),
      },
    })

    const deleteTable = prisma.table.delete({
      where: {
        id: parseInt(id,10),
      },
    })

    const transaction = await prisma.$transaction([deleteColumns, deleteTable])
    console.log("🚀 ===== router.delete ===== transaction:", transaction);
    res.status(200).json({message:"Delete success"})
  }catch(error){
    console.log("🚀 ===== router.get ===== error:", error);
    res.status(500).json({message:'Error'})
  }
})
router.get('/:id/clear',async(req,res) => {
  try{
    const {id}=req.params
    //  await prisma.table.delete({
    //   where:{
    //     id: parseInt(id,10)
    //   }
    // })
    const deleteColumns = prisma.row.deleteMany({
      where: {
        tableId: parseInt(id,10),
      },
    })

    const transaction = await prisma.$transaction([deleteColumns])
    console.log("🚀 ===== router.delete ===== transaction:", transaction);
    res.status(200).json({message:"Clear success"})
  }catch(error){
    console.log("🚀 ===== router.get ===== error:", error);
    res.status(500).json({message:'Error'})
  }
})
module.exports = router;
