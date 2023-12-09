const puppeteer = require('puppeteer')
const {PuppeteerScreenRecorder}=require('puppeteer-screen-recorder')
const fs = require('fs')
const path = require('path')
const mustache = require('mustache')
const { URLSearchParams } = require('url');

// const axios = require('axios')
// const sharp = require('sharp')
const url ="https://vnexpress.net/"
// const url =""
const workflows = [
    {
        id:1,
        name:"trigger"
    },
    {
        id:2,
        name:"new-tab",
        url:"https://google.com"
    },
    {
        id:2,
        name:"form",
        selector:"#APjFqb",
        value:"Puppeteer"
    },
    {
        id:3,
        name:"event-click",
        selector:"body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.FPdoLc.lJ9FBc > center > input.gNO89b"
    },
    {
        id:4,
        name:"finish",
    }
]
async function run () {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    const screenRecorderOptions = {
        followNewTab: true,
        fps: 25,
        aspectRatio: "16:9"
    }
    const savePath = "./test/demo2.mp4";
    const screenRecorder = new PuppeteerScreenRecorder(page, screenRecorderOptions);
    await screenRecorder.start(savePath);
    // some puppeteer action or test
    await page.setViewport({width: 1080, height: 1024});
    await page.goto(url);
    const images = await page.evaluate(() => {
        const elements = document.querySelectorAll('img');
        return [...elements]?.map((item) => {
            const src=item.getAttribute('src')
            return src
            // return src?.split('?')?.[0]
        })
    })
    fs.writeFileSync('images.json', JSON.stringify(images))

    browser.close();
}
const crawler = async() => {
    let images = fs.readFileSync('images.json')
    images = JSON.parse(images)
    for(let i=0;i<images.length;i++){
        const link = images[i]
        const extension = path.extname(link)
        const writable = fs.createWriteStream(`images/image_${i}${extension}`);
        axios({
            method:"GET",
            url:link,
            responseType:"stream"
        }).then((response) => {
            // console.log("🚀 ===== crawler ===== response:", response);
            response?.data.pipe(writable)
            // fs.writeFileSync(`images/image_${i}.png`,response.data)
        })
    }
    // const metadata = await sharp('https://blog.logrocket.com/wp-content/uploads/2022/11/Screen-Shot-2022-09-22-at-12.59.51-PM.png').metadata()
}
const test = async () => {
    try{
      const params = new URLSearchParams({
            // API key (Org Management => API Keys)
            key: 'hloowlcdwmmpmddwjgkwmnoeqnkuhqpybgkxjc',
            // Browser name: chrome, edge, firefox 
            browserName: 'chrome'
        }).toString();
      console.log("🚀 ===== test ===== params:", params);
    // const browser = await puppeteer.launch({
    //     headless: false
    // });
    const browser = await puppeteer.connect({
        // browserWSEndpoint: `wss://cdp.testable.io?${params}`
        browserWSEndpoint: `wss://chrome.browserless.io/?token=8512f9ec-f4be-4f30-a5a8-7f2d6b2d3163&headless=false`
        // browserWSEndpoint: `ws://localhost:3000`,

    });
    const page = await browser.newPage();
    // await page.setViewport({width: 1920, height: 1080});
    // some puppeteer action or test
    await page.goto('https://www.google.com/');
    await browser.close()

    }catch(error){
        console.log("🚀 ===== test ===== error:", error);
    }
}
const runWorkflows = async () => {
    // const browser = await puppeteer.launch({
    //     headless: false
    // });
    // const page = await browser.newPage();
    // await page.setViewport({width: 1920, height: 1080});
    // // some puppeteer action or test
    // await page.goto('https://www.google.com/');
    // await page.evaluate(() => {
    //     const el = document.querySelectorAll('#APjFqb')
    //     const searchBtn = document.querySelectorAll('body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf.emcav > div.UUbT9.EyBRub > div.aajZCb > div.lJ9FBc > center > input.gNO89b')
    //     el[0].value="Puppeteer"
    //     // searchBtn?.[0].click()
    // })
    // await page.waitForNavigation()
    // await browser.close()

    let page=null 
    for(const item of workflows){
        if(item?.name==='trigger'){
            const browser = await puppeteer.launch({
                headless: false
            });
            page = await browser.newPage();
            await page.setViewport({width: 1920, height: 1080});
        }else if(item?.name==='new-tab'){
            await page.goto(item?.url)
        }else if(item?.name==='form'){
            console.log("🚀 ===== runWorkflows ===== item:", item);
            await page.evaluate((data) => {
                console.log("🚀 ===== awaitpage.evaluate ===== data:", data);
                const el = document.querySelectorAll(data?.selector)
                el[0].value="Puppeteer"
                // searchBtn?.[0].click()
            },item)
        } else if(item?.name==='event-click'){
            console.log("🚀 ===== runWorkflows ===== item:", item);
            await page.evaluate((data) => {
                const el = document.querySelectorAll(data?.selector)
                el?.[0].click()
            },item)
            await page.waitForNavigation()

        }else{
            await this.browser.close()
        }
    }

}
test()
// crawler()
// run();
// runWorkflows()
const test1 = () => {
const values={
    name:"luannguyen",
    age:22,
    posts:[
        {
            title:'Post1'
        },
        {
            title:'Post2'
        }
        
    ]
}
const result= mustache.render("{{#posts}}-{{title}}{{/posts}}",values)
console.log("🚀 ===== test1 ===== result:", result);
console.log(result.split('-'))
console.log(mustache.render("{{posts.0}}",values))
}
