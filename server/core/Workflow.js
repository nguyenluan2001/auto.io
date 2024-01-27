const { get, isEmpty, last, has } = require('lodash');
const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const { NODE_ENV } = process.env;
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

class Workflow {
  constructor(uuid, workflows) {
    this.browser = null;
    this.page = null;
    this.uuid = uuid;
    this.workflows = workflows;
    this.handlers = {
      trigger: async (data) => await this.trigger(data),
      'new-tab': async (data) => await this.newTab(data),
      form: async (data) => await this.form(data),
      'event-click': async (data) => await this.eventClick(data),
      'get-text': async (data) => await this.getText(data),
      'get-attribute': async (data) => await this.getAttribute(data),
      'loop-data': async (data) => await this.loop(data),
    };
    this.loopData = {};
    this.loopControl = new Map();
    this.currentLoopId = null;
    this.tableData = [];
    this.tableId = null;
  }

  async launch() {
    const config =
      NODE_ENV === 'development'
        ? {
            headless: false,
          }
        : {headless:'new'};
    this.browser = await puppeteer.launch(config);
    const workflow = await prisma.workflows.findMany({
      where:{
        uuid:this.uuid
      },
      include:{
        table:true
      }
    })
    if(workflow?.[0]?.table?.id){
      this.tableId = workflow[0]?.table?.id
    }
  }

  async close() {
    await this.browser?.close();
  }

  async trigger() {
    console.log('===== TRIGGER =====');
    this.page = await this.browser?.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async newTab({ url }) {
    console.log('===== NEW TAB =====');
    console.log('🚀 ===== Workflow ===== newTab ===== url:', url);
    await this.page?.goto(url);
  }

  async form({ selector, value, sourceData }) {
    let newValue = '';
    if (value.match(/{{.*}}/)) {
      const path = value.replace('{{', '').replace('}}', '');
      const attributePath = path.split('.').splice(2).join('.');
      newValue = get(sourceData, attributePath);
    } else {
      newValue = value;
    }
    console.log('🚀 ===== Workflow ===== form ===== newValue:', newValue);
    // await this.page.click(selector, {clickCount: 3})
    await this.page.focus(selector);
    await this.page.keyboard.down('Control');
    await this.page.keyboard.press('A');
    await this.page.keyboard.up('Control');
    await this.page.keyboard.press('Backspace');
    await this.page.type(selector, newValue);
  }

  async eventClick({ selector }) {
    console.log('===== EVENT CLICK =====');
    const searchResultSelector = selector;
    await this.page.waitForSelector(searchResultSelector);
    await this.page.click(searchResultSelector);
  }

  async getText({ selector, destination, selector_type='SINGLE',loop_through, select, order=1 }) {
    console.log("🚀 ===== Workflow ===== getText ===== order:", order);
    console.log('===== GET TEXT =====');
    let el=''
    if(selector_type==='SINGLE'){
       el = await this.page.waitForSelector(selector);
    }else{
      console.log('selector', `${loop_through}:nth-child(${order}) ${select}`)
       el = await this.page.$(`${loop_through}:nth-child(${order}) ${select}`.replace('\'', "\""));
    }
    console.log("🚀 ===== Workflow ===== getText ===== el:", el);
    if(!el) return
    const text = await (await el.getProperty('textContent')).jsonValue();
    console.log("🚀 ===== Workflow ===== getText ===== text:", text);
    const isVariable = destination?.VARIABLE?.selected;
    const isTable = destination?.TABLE?.selected;
    if (isTable) {
      const column = destination?.TABLE?.column;
      if (isEmpty(this.tableData)) {
        const newData = {
          [column]: text,
        };
        const newRow = await prisma.row.create({
          data: {
            data: newData,
            tableId: parseInt(this.tableId, 10),
          },
        });
        console.log('🚀 ===== Workflow ===== getText ===== newRow:', newRow);
        this.tableData.push(newRow);
      } else {
        const lastRow = last(this.tableData);
        const len = this.tableData.length;
        if (!has(lastRow, column)) {
          const newData = {
            ...lastRow.data,
            [column]: text,
          };
          const newRow = await prisma.row.update({
            where: {
              id: lastRow?.id,
            },
            data: {
              data: newData,
            },
          });
          this.tableData[len - 1] = newRow;
        } else {
          const newData = {
            [column]: text,
          };
          const newRow = await prisma.row.create({
            data: {
              data: newData,
              tableId: parseInt(this.tableId, 10),
            },
          });
          console.log('🚀 ===== Workflow ===== getText ===== newRow:', newRow);
          this.tableData.push(newRow);
        }
      }
    }
    // return text;
  }

  async getAttribute({ selector, destination, selector_type='SINGLE',loop_through, select, order=1, attribute }) {
    console.log("🚀 ===== Workflow ===== getAttribute ===== selector:", selector);
    console.log('===== GET ATTRIBUTE =====');
    let text=''
    if(selector_type==='SINGLE'){
      text = await this.page.$eval(selector, (element, attribute)=>  
         element.getAttribute(attribute)
      , attribute)
    }else{
      text = await this.page.$eval( `${loop_through}:nth-child(${order}) ${select}`, (element, attribute)=>  
         element.getAttribute(attribute)
      , attribute)
    }
    if(!text) return
    const isVariable = destination?.VARIABLE?.selected;
    const isTable = destination?.TABLE?.selected;
    if (isTable) {
      const column = destination?.TABLE?.column;
      if (isEmpty(this.tableData)) {
        const newData = {
          [column]: text,
        };
        const newRow = await prisma.row.create({
          data: {
            data: newData,
            tableId: parseInt(this.tableId, 10),
          },
        });
        console.log('🚀 ===== Workflow ===== getText ===== newRow:', newRow);
        this.tableData.push(newRow);
      } else {
        const lastRow = last(this.tableData);
        const len = this.tableData.length;
        if (!has(lastRow, column)) {
          const newData = {
            ...lastRow.data,
            [column]: text,
          };
          const newRow = await prisma.row.update({
            where: {
              id: lastRow?.id,
            },
            data: {
              data: newData,
            },
          });
          this.tableData[len - 1] = newRow;
        } else {
          const newData = {
            [column]: text,
          };
          const newRow = await prisma.row.create({
            data: {
              data: newData,
              tableId: parseInt(this.tableId, 10),
            },
          });
          console.log('🚀 ===== Workflow ===== getText ===== newRow:', newRow);
          this.tableData.push(newRow);
        }
      }
    }
    // return text;
  }

  async loop({ id, workflows, loop_through='CUSTOM_DATA' }) {
    try{
      console.log("🚀 ===== Workflow ===== loop ===== workflows:", JSON.stringify(workflows, null, 2));
      if(loop_through==='CUSTOM_DATA'){
        for (const data of this.loopData[id]) {
          for (let i = 0; i < workflows?.length; i++) {
            const widget = workflows[i];
            await this.handlers?.[widget?.key]({
              ...widget,
              sourceData: data,
            });
          }
          await this.page.waitForTimeout(2000);
        }
      }else{
        const {from, to}=this.loopData[id]
        console.log("🚀 ===== Workflow ===== loop ===== from:", from);
        console.log("🚀 ===== Workflow ===== loop ===== to:", to);
        for(let i=parseInt(from,10);i<=parseInt(to,10);i++){
          console.log("🚀 ===== Workflow ===== loop ===== i:", i);
          for (let j = 0; j < workflows?.length; j++) {
            const widget = workflows[j];
            await this.handlers?.[widget?.key]({
              ...widget,
              order: i,
            });
          }
          this.tableData=[]
          await sleep(2000)
          // await this.page.waitForTimeout(2000);
        }
      }
    }catch(error){
      console.log("🚀 ===== Workflow ===== loop ===== error:", error);
    }
  }

  async breakLoop({ loopID }) {
    const brokenLoop = this.loopControl.get(loopID);
    console.log('🚀 ===== Workflow ===== run ===== brokenLoop:', brokenLoop);
    this.loopData = {
      ...this.loopData,
      [loopID]: brokenLoop?.data,
    };
    console.log('loopData', this.loopData);
    await this.loop({ id: loopID, workflows: brokenLoop.workflows, loop_through: brokenLoop.loop_through  });
    this.currentLoopId = null;
    await this.loopControl.delete(loopID);
  }

  async run() {
    await this.launch();
    const savePath = './video/demo.mp4';
    const screenRecorderOptions = {
      followNewTab: true,
      fps: 25,
      aspectRatio: '16:9',
    };
    let screenRecorder = null;
    for (let i = 0; i < this.workflows?.length; i++) {
      const widget = this.workflows[i];
      if (widget?.key === 'trigger') {
        await this.trigger();
        screenRecorder = new PuppeteerScreenRecorder(
          this.page,
          screenRecorderOptions
        );
        await screenRecorder.start(savePath);
      } else if (widget?.key === 'loop-data') {
        this.loopControl.set(widget?.id, {
          data: widget?.loop_through==='CUSTOM_DATA'? JSON.parse(widget?.data):widget?.numbers,
          workflows: [],
          loop_through: widget?.loop_through,
        });
        this.currentLoopId = widget?.id;
      } else if (widget?.key === 'break-loop') {
        await this.breakLoop(widget);
      } else {
        if (this.loopControl.size === 0) {
          await this.handlers?.[widget?.key](widget);
        } else {
          const currentLoop = this.loopControl.get(this.currentLoopId);
          this.loopControl.set(this.currentLoopId, {
            ...currentLoop,
            workflows: [...(currentLoop?.workflows || []), widget],
          });
        }
      }
    }
    await screenRecorder.stop();
    await fs.writeFileSync(
      path.resolve('./', 'data', `data-${Date.now()}.json`),
      JSON.stringify(this.tableData)
    );
    console.log('END');
    // await this.close()
  }
}
module.exports = Workflow;
