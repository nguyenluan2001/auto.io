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
            'get-text': async(data) => await this.getText(data)
        }
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

    async form({selector,value}) {
        console.log('===== FORM =====')
        await this.page.type(selector,value);
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

    async run() {
        await this.launch()
        for(const item of this.workflows){
            if(item?.key==='trigger'){
                await this.trigger()
            }else {
                // await this.newTab(item)
                await this.handlers?.[item?.key](item)
            }
        }
        console.log('END')
        // await this.close()

    }
}
module.exports = Workflow