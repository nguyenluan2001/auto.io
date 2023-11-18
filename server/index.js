const express = require('express')

const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const puppeteer = require('puppeteer')
const { map } = require('lodash')
const Workflow = require('./core/Workflow')

app.use(cors())
app.use(express.json())

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
app.post('/test', (req,res) => {
    const body=req?.body
    runWorkflows(map(body,'data'))
    return res.json({message:'connect oke'})
})

app.listen(3000, () => {
   console.log('Server start at 3000') 
})