const { get, isEmpty, last, has } = require('lodash');
const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const { NODE_ENV } = process.env;

class Workflow {
  constructor(workflows) {
    this.browser = null;
    this.page = null;
    this.workflows = workflows;
    this.handlers = {
      trigger: async (data) => await this.trigger(data),
      'new-tab': async (data) => await this.newTab(data),
      form: async (data) => await this.form(data),
      'event-click': async (data) => await this.eventClick(data),
      'get-text': async (data) => await this.getText(data),
      'loop-data': async (data) => await this.loop(data),
    };
    this.loopData = {};
    this.loopControl = new Map();
    this.currentLoopId = null;
    this.tableData = [];
  }

  async launch() {
    const config =
      NODE_ENV === 'development'
        ? {
            headless: false,
          }
        : {headless:'new'};
    this.browser = await puppeteer.launch(config);
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

  async getText({ selector, destination }) {
    console.log('===== GET TEXT =====');
    // const el = await this.page.waitForSelector(selector);
    const el = await this.page.$(selector);
    const text = await (await el.getProperty('textContent')).jsonValue();
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
            tableId: parseInt(3, 10),
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
              tableId: parseInt(3, 10),
            },
          });
          console.log('🚀 ===== Workflow ===== getText ===== newRow:', newRow);
          this.tableData.push(newRow);
        }
      }
    }
    console.log('🚀 ===== Workflow ===== getText ===== text:', text);
    return text;
  }

  async loop({ id, workflows }) {
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
    // const data = this.loopData[id]
    // for(let i=0; i<data.length;i++){
    //     for(let j=0;j<workflows?.length;j++){
    //         const widget = workflows[j]
    //         await this.handlers?.[widget?.key]({
    //             ...widget,
    //             sourceData:data,
    //             template:'{{}}'

    //         })
    //     }
    //     await this.page.waitForTimeout(2000)
    // }
  }

  async breakLoop({ loopID }) {
    const brokenLoop = this.loopControl.get(loopID);
    console.log('🚀 ===== Workflow ===== run ===== brokenLoop:', brokenLoop);
    this.loopData = {
      ...this.loopData,
      [loopID]: brokenLoop?.data,
    };
    console.log('loopData', this.loopData);
    this.loop({ id: loopID, workflows: brokenLoop.workflows });
    this.currentLoopId = null;
    this.loopControl.delete(loopID);
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
          data: JSON.parse(widget?.data),
          workflows: [],
        });
        this.currentLoopId = widget?.id;
      } else if (widget?.key === 'break-loop') {
        this.breakLoop(widget);
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
