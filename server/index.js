const express = require('express')
const puppeteer = require('puppeteer')

const app = express()
const cors = require('cors')
const { map } = require('lodash')
require('dotenv').config()
const { PrismaClient } =require('@prisma/client')
const Workflow = require('./core/Workflow')


app.use(cors())
app.use(express.json())
const prisma = new PrismaClient()


// const workflows = [
//     {
//         id:1,
//         name:"trigger"
//     },
//     {
//         id:2,
//         name:"new-tab",
//         url:"https://google.com"
//     },
//     {
//         id:2,
//         name:"form",
//         selector:"#APjFqb",
//         value:"Puppeteer"
//     },
//     {
//         id:3,
//         name:"event-click",
//         selector:"body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.FPdoLc.lJ9FBc > center > input.gNO89b"
//     },
//     {
//         id:4,
//         name:"finish",
//     }
// ]
const runWorkflows = async (workflows) => {
    try{

    console.log("🚀 ===== runWorkflows ===== workflows:", workflows);
    // const browser = await puppeteer.launch({
    //     headless: false
    // });
    // let page=null
    // for(const item of workflows){
    //     if(item?.key==='trigger'){
    //         console.log('==== TRIGGER ====')
    //         // const browser = await puppeteer.launch({
    //         //     headless: false
    //         // });
    //         page = await browser.newPage();
    //         await page.setViewport({width: 1920, height: 1080});
    //     }else if(item?.key==='new-tab'){
    //         console.log('==== NEW TAB ====')
    //         await page.goto(item?.url)
    //     }else if(item?.key==='form'){
    //         console.log('=== form ===')
    //         console.log("🚀 ===== runWorkflows ===== item:", item);
    //           await page.type(item?.selector,item?.value);
    //     } else if(item?.key==='event-click'){
    //         console.log('=== CLICK ===')
    //         console.log("🚀 ===== runWorkflows ===== item:", item);
    //         const searchResultSelector =item?.selector;
    //         await page.waitForSelector(searchResultSelector);
    //         await page.click(searchResultSelector);
    //     }else{
    //         await browser.close()
    //     }
    // }
    const workflow = new Workflow(workflows)
    workflow.run()
    }catch(error){
        console.log('error',error)
    }

}
app.post('/run', (req,res) => {
    const body=req?.body
    const data = body.map((item) => ({
      ...item?.data,
      id: item?.id
    }))
    runWorkflows(data)
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
  const workflows = await prisma.workflows.create({
    data:body
  })
  return res.json(workflows)
})

app.get('/', async(req,res) => {
  const workflows = await prisma.workflows.findMany()
  return res.json(workflows)
})

app.listen(3000, () => {
    console.log('url',process.env.DATABASE_URL)
   console.log('Server start at 3000') 
})