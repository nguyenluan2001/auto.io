const express = require('express');
const { omit } = require('lodash');
const { prisma } = require('../config/prisma');
const {parseQuery} = require('../helper/request');
const {  exportTable } = require('../helper/export');


const router = express.Router();

const ROWS_PER_PAGE=10

router.post('/',async(req,res) => {
  const body=req?.body
  const response = await prisma.table.create({
    data:{
      name:body?.name,
      columns:{
        create: body?.columns
      },
      user:{
          connect: { id: req?.user?.id }
      },
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
      where:{
          user:{
              id: req?.user?.id
          }
      },
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
    const {id } = req.params
    const {query} = req
    const table = await prisma.table.findUnique({
      // select:{
      //   id:true,
      //   name:true
      // },
      where:{
        id:parseInt(id,10)
      },
      include:{
        columns:true,
        _count:{
          select:{
            rows:true
          }
        }
        // rows:true
      }
    })
    const rows = await prisma.row.findMany({
      where:{
        table:{
          id: parseInt(id, 10)
        }
      },
      ...parseQuery(query)
    })
    res.status(200).json({
      id: table?.id,
      name:table?.name,
      columns:table?.columns,
      createdAt: table?.createdAt,
      rows,
      meta:{
        totalPages: Math.ceil((table?._count?.rows || 0)/ROWS_PER_PAGE)
      }
    })
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
router.get('/:id/export',async(req,res) => {
  try{
    const {id}=req.params
    const {t:type}=req.query
    const table = await prisma.table.findUnique({
      where:{
        id:parseInt(id,10)
      },
      include:{
        columns:true,
        _count:{
          select:{
            rows:true
          }
        }
      }
    })
    let rows = await prisma.row.findMany({
      where:{
        table:{
          id: parseInt(id, 10)
        }
      },
      orderBy:{
        id:'asc'
      }
    })
    rows = rows.map((row) => row?.data)
    const columns = table?.columns?.map((col) => ({
      header: col?.name,
      key: col?.name,
      width: 10,
    }))
    return exportTable({type, table:{columns, rows}, res})
  }catch(error){
    console.log("🚀 ===== router.get ===== error:", error);
    res.status(500).json({message:'Error'})
  }
})
module.exports = router;
