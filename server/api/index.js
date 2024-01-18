const express = require('express')
const puppeteer = require('puppeteer')
const { v4: uuidv4 } = require('uuid');


const app = express()
const cors = require('cors')
const { map, omit } = require('lodash')
require('dotenv').config()
const { PrismaClient } =require('@prisma/client')
const Workflow = require('../core/Workflow')


app.use(cors())
app.use(express.json())
const prisma = new PrismaClient()

const runWorkflows = async ({workflows, uuid}, res) => {
    try{

    console.log("🚀 ===== runWorkflows ===== workflows:", workflows);
    const workflow = new Workflow(uuid, workflows)
    workflow.run()
    }catch(error){
        console.log('error',error)
    }

}
app.post('/run/:uuid', (req,res) => {
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
app.get('/loop', async(req,res) => {
    const data = [
      {
        email:'abc@gmail.com',
        password:'123456',
      },
      {
        email:'xyz@gmail.com',
        password:'123456',
      }
    ]
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://app.smartr.vn/login')
    for(const item of data){
        const emailEl='#__next > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.css-6dio9a-MuiGrid-root > div > div > div > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation0.MuiCard-root.css-ac3f91-MuiPaper-root-MuiCard-root > div > form > div.css-nen11g-MuiStack-root > div:nth-child(1) > div > div > input'
        const passwordEl='#__next > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.css-6dio9a-MuiGrid-root > div > div > div > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation0.MuiCard-root.css-ac3f91-MuiPaper-root-MuiCard-root > div > form > div.css-nen11g-MuiStack-root > div:nth-child(3) > div > div > input'
        await page.click(emailEl, {clickCount: 3})
        await page.type(emailEl,item?.email);
        await page.click(passwordEl, {clickCount: 3})
        await page.type(passwordEl,item?.password);

        const searchResultSelector ='#__next > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.css-6dio9a-MuiGrid-root > div > div > div > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation0.MuiCard-root.css-ac3f91-MuiPaper-root-MuiCard-root > div > form > button';
        await page.waitForSelector(searchResultSelector);
        await page.click(searchResultSelector);
        await page.waitForTimeout(2000)
    }
    
    return res.json({message:'connect oke'})
})
app.post('/create', async(req,res) => {

  const body=req?.body
  console.log("🚀 ===== app.get ===== body:", body);
  const workflow = await prisma.workflows.create({
    data:{
        ...body,
        uuid: uuidv4(),
      ...omit(body,['tableId']),
    },
  })
  if(body?.tableId){
    await prisma.table.update({
      where:{
        id: body?.tableId,
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
app.get('/workflows', async(req,res) => {
  const workflows = await prisma.workflows.findMany()
  return res.json(workflows)
})
app.get('/workflow/:uuid', async(req,res) => {
  console.log('params', req.params)
  const {uuid}=req.params
  const workflow = await prisma.workflows.findFirst({
  where: {
    uuid,
  },
  include:{
    table:{
      include:{
        columns:true
      }
    },
  }
})
  return res.json(workflow)
})
app.put('/workflow/:uuid', async(req,res) => {
  console.log('params', req.params)
  const {uuid}=req.params
  console.log("🚀 ===== app.put ===== uuid:", uuid);
  const {body} = req
  const workflow = await prisma.workflows.findFirst({
    where:{
      uuid
    }
  })
   console.log("🚀 ===== app.put ===== workflow:", workflow);
   await prisma.workflows.updateMany({
  where: {
    uuid,
  },
  data:{
    ...omit(body,['tableId']),
  },
})
  await prisma.table.update({
    where:{
      id: body?.tableId,
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
  return res.json(workflow)
})
app.post('/tables',async(req,res) => {
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
  console.log("🚀 ===== app.post ===== response:", response);
  res.json({message:'connect oke'})
  console.log("🚀 ===== app.post ===== body:", body);
})
app.get('/tables',async(req,res) => {
  try{
    const tables = await prisma.table.findMany({
      include:{
        columns:true
      }
    })
    res.status(200).json({tables})
  }catch(error){
    console.log("🚀 ===== app.get ===== error:", error);
    res.status(500).json({message:'Error'})
  }
})
app.get('/tables/:id',async(req,res) => {
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
    console.log("🚀 ===== app.get ===== error:", error);
    res.status(500).json({message:'Error'})
  }
})
app.put('/tables/:id',async(req,res) => {
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
    console.log("🚀 ===== app.get ===== error:", error);
    res.status(500).json({message:'Error'})
  }
})
app.delete('/tables/:id',async(req,res) => {
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
    console.log("🚀 ===== app.delete ===== transaction:", transaction);
    res.status(200).json({message:"Delete success"})
  }catch(error){
    console.log("🚀 ===== app.get ===== error:", error);
    res.status(500).json({message:'Error'})
  }
})
app.get('/tables/:id/clear',async(req,res) => {
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
    console.log("🚀 ===== app.delete ===== transaction:", transaction);
    res.status(200).json({message:"Clear success"})
  }catch(error){
    console.log("🚀 ===== app.get ===== error:", error);
    res.status(500).json({message:'Error'})
  }
})

app.get('/attribute', async(req,res) => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://app.smartr.vn')
    const v = await page.$eval("#radix-\:Reckt36\:-content-personalized > div > article:nth-child(1) > section.flex.flex-col.gap-2.sm\:gap-4 > div.flex.flex-col.gap-4.md\:gap-5.w-full > div > div.w-full.rounded-xl.md\:rounded-lg.bg-gray-100.dark\:bg-gray-900.relative.cursor-pointer.md\:basis-\[180px\].md\:h-\[108px\].md\:shrink-0 > div.hidden.md\:block.w-full.h-full > a > span > img", element=> element.getAttribute("src"))
    console.log("🚀 ===== app.get ===== t:", v);
    return res.json({message:'connect oke'})
})
app.listen(3000, () => {
    console.log('url',process.env.DATABASE_URL)
   console.log('Server start at 3000') 
})