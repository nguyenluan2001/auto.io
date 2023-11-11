const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const puppeteer = require('puppeteer')
const { map } = require('lodash')

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
    const browser = await puppeteer.launch({
        headless: false
    });
    let page=null
    for(const item of workflows){
        if(item?.name==='trigger'){
            // const browser = await puppeteer.launch({
            //     headless: false
            // });
            page = await browser.newPage();
            await page.setViewport({width: 1920, height: 1080});
        }else if(item?.name==='new-tab'){
            await page.goto(item?.url)
        }else if(item?.name==='form'){
            console.log('=== form ===')
            console.log("🚀 ===== runWorkflows ===== item:", item);
            await page.evaluate((data) => {
                console.log("🚀 ===== awaitpage.evaluate ===== data:", data);
                const el = document.querySelectorAll(data?.selector)
                console.log("🚀 ===== awaitpage.evaluate ===== el:", el);
                // el[0].value=data?.value
                // searchBtn?.[0].click()
            },item)
        } else if(item?.name==='event-click'){
            console.log('=== CLICK ===')
            console.log("🚀 ===== runWorkflows ===== item:", item);
            await page.evaluate((data) => {
                console.log("🚀 ===== awaitpage.evaluate ===== data:", data);
                let el = document.querySelectorAll(data?.selector)
                el = [...el]
                console.log("🚀 ===== awaitpage.evaluate ===== el:", el);
                el?.[0].click()
            },item)

        }else{
            await browser.close()
        }
    }

}
app.post('/test', (req,res) => {
    const body=req?.body
    console.log("🚀 ===== app.get ===== body:", body);
    runWorkflows(map(body,'data'))
    return res.json({message:'connect oke'})
})

app.listen(3000, () => {
   console.log('Server start at 3000') 
})