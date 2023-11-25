const { get, isEmpty } = require('lodash')
const puppeteer = require('puppeteer')

class Workflow {
    constructor(workflows){
        this.browser=null
        this.page =null
        this.workflows=workflows
        this.handlers={
            trigger: async (data) => await this.trigger(data),
            'new-tab': async (data) => await this.newTab(data),
            form: async (data) => await this.form(data),
            'event-click': async(data) => await this.eventClick(data),
            'get-text': async(data) => await this.getText(data),
            'loop-data': async(data) => await this.loop(data)
        }
        this.loopData={}
        this.loopControl=new Map()
        this.currentLoopId=null
    }

    async launch() {
        this.browser = await puppeteer.launch({
            headless: false
        });
    }

    async close() {
        await this.browser?.close()
    }

    async trigger() {
        console.log('===== TRIGGER =====')
        this.page=await this.browser?.newPage()
        await this.page.setViewport({width: 1920, height: 1080});
    }

    async newTab({url}) {
        console.log('===== NEW TAB =====')
        console.log("🚀 ===== Workflow ===== newTab ===== url:", url);
        await this.page?.goto(url)
    }

    async form({selector,value, sourceData}) {
        let newValue=''
        if(value.match(/{{.*}}/)){
            const path = value.replace('{{','').replace('}}','')
            const attributePath = path.split('.').splice(2).join('.')
            newValue=get(sourceData,attributePath)

        }else{
            newValue=value
        }
        await this.page.click(selector, {clickCount: 3})
        await this.page.type(selector,newValue);
    }

    async eventClick({selector}) {
        console.log('===== EVENT CLICK =====')
        const searchResultSelector =selector;
        await this.page.waitForSelector(searchResultSelector);
        await this.page.click(searchResultSelector);
    }

    async getText({selector}) {
        console.log('===== GET TEXT =====')
        // const el = await this.page.waitForSelector(selector);
        const el = await this.page.$(selector)
        const text = await (await el.getProperty('textContent')).jsonValue()
        console.log("🚀 ===== Workflow ===== getText ===== text:", text);
    }

    async loop({id,workflows}){
        for(const data of this.loopData[id]){
            for(let i=0;i<workflows?.length;i++){
                const widget = workflows[i] 
                await this.handlers?.[widget?.key]({
                    ...widget,
                    sourceData:data
                })
            }
            await this.page.waitForTimeout(2000)
        }
    }

    async breakLoop({loopID}){
        const brokenLoop = this.loopControl.get(loopID)
        console.log("🚀 ===== Workflow ===== run ===== brokenLoop:", brokenLoop);
        this.loopData = {
            ...this.loopData,
            [loopID]: brokenLoop?.data
        }
        console.log('loopData',this.loopData)
        this.loop({id:loopID,workflows: brokenLoop.workflows})
        this.currentLoopId=null
        this.loopControl.delete(loopID)
    }

    async run() {
        await this.launch()
        for(let i=0;i<this.workflows?.length; i++){
            const widget = this.workflows[i]
            if(widget?.key==='trigger'){
                await this.trigger()
            }else if(widget?.key==='loop-data'){
                this.loopControl.set(widget?.id, {
                        data: JSON.parse(widget?.data),
                        workflows:[]
                })
                this.currentLoopId=widget?.id
            } else if(widget?.key==='break-loop'){
                this.breakLoop(widget)
            } else {
                if(this.loopControl.size===0){
                    await this.handlers?.[widget?.key](widget)
                }else{
                    const currentLoop = this.loopControl.get(this.currentLoopId)
                    this.loopControl.set(this.currentLoopId, {
                        ...currentLoop,
                        workflows:[...(currentLoop?.workflows||[]),widget]
                    })
                }
            }
        }
        console.log('END')
        // await this.close()

    }
}
module.exports = Workflow