const { get, isEmpty, last, has } = require('lodash');
const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const { NODE_ENV } = process.env;
const sleep = (waitTimeInMs) =>
  new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

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
      'scroll': async (data) => await this.scroll(data),
    };
    this.loopData = {};
    this.loopControl = new Map();
    this.currentLoopId = null;
    this.breakLoopStack = []


    this.tableData = [];
    this.tableId = null;
  }

  async launch() {
    const config =
      NODE_ENV === 'development'
        ? {
            headless: false,
          }
        : { headless: 'new' };
    this.browser = await puppeteer.launch(config);
    const workflow = await prisma.workflows.findMany({
      where: {
        uuid: this.uuid,
      },
      include: {
        table: true,
      },
    });
    if (workflow?.[0]?.table?.id) {
      this.tableId = workflow[0]?.table?.id;
    }
  }

  async close() {
    await this.browser?.close();
  }

  async insertTable({destination, text}){
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
          this.tableData.push(newRow);
        }
      }
  }

  async trigger() {
    console.log('===== TRIGGER =====');
    this.page = await this.browser?.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async newTab({ url, sourceData }) {
    console.log('===== NEW TAB =====');
    let newUrl=''
    if (url.match(/{{.*}}/)) {
      const path = url.replace('{{', '').replace('}}', '');
      const attributePath = path.split('.').splice(2).join('.');
      newUrl = get(sourceData, attributePath);
    }else {
      newUrl=url
    }

    await this.page?.goto(newUrl);
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

  async getText({
    selector,
    destination,
    selector_type = 'SINGLE',
    loop_through,
    select,
    order = 1,
  }) {
    console.log('===== GET TEXT =====');
    let el = '';
    if (selector_type === 'SINGLE') {
      el = await this.page.waitForSelector(selector);
    } else {
      el = await this.page.$(
        `${loop_through}:nth-child(${order}) ${select}`.replace("'", '"')
      );
    }
    if (!el) return;
    const text = await (await el.getProperty('textContent')).jsonValue();
    const isVariable = destination?.VARIABLE?.selected;
    const isTable = destination?.TABLE?.selected;
    if (isTable) {
      await this.insertTable({destination, text})
    }
    // return text;
  }

  async getAttribute({
    selector,
    destination,
    selector_type = 'SINGLE',
    loop_through,
    select,
    order = 1,
    attribute,
  }) {
    console.log('===== GET ATTRIBUTE =====');
    let text = '';
    if (selector_type === 'SINGLE') {
      text = await this.page.$eval(
        selector,
        (element, attribute) => element.getAttribute(attribute),
        attribute
      );
    } else {
      text = await this.page.$eval(
        `${loop_through}:nth-child(${order}) ${select}`,
        (element, attribute) => element.getAttribute(attribute),
        attribute
      );
    }
    if (!text) return;
    const isVariable = destination?.VARIABLE?.selected;
    const isTable = destination?.TABLE?.selected;
    if (isTable) {
      await this.insertTable({destination, text})
    }
    // return text;
  }

  async scroll({
    selector,
    scroll_behavior,
    horizontal,
    vertical,
    order = 1,
    attribute,
  }) {
    console.log('=== SCROLL ===')
    await this.page.keyboard.press("PageDown");
    await sleep(3000)
  }

  async loop({ id, workflows, loop_through = 'CUSTOM_DATA' }) {
    try {
      if (loop_through === 'CUSTOM_DATA') {
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
      } else {
        const { from, to } = this.loopData[id];
        for (let i = parseInt(from, 10); i <= parseInt(to, 10); i++) {
          console.log('🚀 ===== Workflow ===== loop ===== i:', i);
          for (let j = 0; j < workflows?.length; j++) {
            const widget = workflows[j];
            await this.handlers?.[widget?.key]({
              ...widget,
              order: i,
            });
          }
          this.tableData = [];
          await sleep(2000);
          // await this.page.waitForTimeout(2000);
        }
      }
    } catch (error) {
      console.log('🚀 ===== Workflow ===== loop ===== error:', error);
    }
  }

  async breakLoop(widget) {
    const {loopID} = widget
    // this.breakLoopStack.push(widget)
    const brokenLoop = this.loopControl.get(loopID);
    this.loopData = {
      ...this.loopData,
      [loopID]: brokenLoop?.data,
    };
    await this.loop({
      id: loopID,
      workflows: brokenLoop.workflows,
      loop_through: brokenLoop.loop_through,
    });
    this.currentLoopId = null;
    await this.loopControl.delete(loopID);
  }

  async run() {
    await this.launch();
    for (let i = 0; i < this.workflows?.length; i++) {
      const widget = this.workflows[i];
      switch (widget?.key) {
        case 'trigger': {
          await this.trigger();
          break;
        }
        case 'loop-data': {
          this.loopControl.set(widget?.id, {
            data:
              widget?.loop_through === 'CUSTOM_DATA'
                ? JSON.parse(widget?.data)
                : widget?.numbers,
            workflows: [],
            loop_through: widget?.loop_through,
          });
          this.currentLoopId = widget?.id;
          // console.log('loopControl', [...this.loopControl.entries()])
          break;
        }
        case 'break-loop': {
          // await this.breakLoop(widget);
          this.breakLoopStack.push(widget)
          break;
        }
        default: {
          if (this.loopControl.size === 0) {
            await this.handlers?.[widget?.key](widget);
          } else {
            const currentLoop = this.loopControl.get(this.currentLoopId);
            this.loopControl.set(this.currentLoopId, {
              ...currentLoop,
              workflows: [...(currentLoop?.workflows || []), widget],
            });
          }
          break;
        }
      }
      if(this.breakLoopStack.length===this.loopControl.size){
        while(!isEmpty(this.breakLoopStack)){
          const breakLoop = this.breakLoopStack.pop()
          await this.breakLoop(breakLoop)
        }
      }
    }
    // await this.close()
  }
}
module.exports = Workflow;
