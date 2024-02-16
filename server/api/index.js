const express = require('express')
const puppeteer = require('puppeteer')
const { v4: uuidv4 } = require('uuid');


const app = express()
const cors = require('cors')
const queryType = require('query-types');
const cookieParser = require('cookie-parser')
const passport = require('passport');
const session = require('express-session')

const workflowRouter = require('../routes/workflows')
const tableRouter = require('../routes/tables')
const authRouter = require('../routes/auth');
const userRouter = require('../routes/users');
const processRouter = require('../routes/process');
const { auth } = require('../middlewares/auth');
require('dotenv').config()
require('../config/passport')

app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use(queryType.middleware())
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}))
app.use(passport.initialize())
app.use(passport.session())


app.use('/workflows', auth, workflowRouter)
app.use('/tables', tableRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', auth, userRouter)
app.use('/api/processes', auth, processRouter)

// app.get('/loop', async(req,res) => {
//     const data = [
//       {
//         email:'abc@gmail.com',
//         password:'123456',
//       },
//       {
//         email:'xyz@gmail.com',
//         password:'123456',
//       }
//     ]
//     const browser = await puppeteer.launch({
//         headless: false
//     });
//     const page = await browser.newPage();
//     await page.goto('https://app.smartr.vn/login')
//     for(const item of data){
//         const emailEl='#__next > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.css-6dio9a-MuiGrid-root > div > div > div > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation0.MuiCard-root.css-ac3f91-MuiPaper-root-MuiCard-root > div > form > div.css-nen11g-MuiStack-root > div:nth-child(1) > div > div > input'
//         const passwordEl='#__next > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.css-6dio9a-MuiGrid-root > div > div > div > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation0.MuiCard-root.css-ac3f91-MuiPaper-root-MuiCard-root > div > form > div.css-nen11g-MuiStack-root > div:nth-child(3) > div > div > input'
//         await page.click(emailEl, {clickCount: 3})
//         await page.type(emailEl,item?.email);
//         await page.click(passwordEl, {clickCount: 3})
//         await page.type(passwordEl,item?.password);

//         const searchResultSelector ='#__next > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.css-6dio9a-MuiGrid-root > div > div > div > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation0.MuiCard-root.css-ac3f91-MuiPaper-root-MuiCard-root > div > form > button';
//         await page.waitForSelector(searchResultSelector);
//         await page.click(searchResultSelector);
//         await page.waitForTimeout(2000)
//     }
    
//     return res.json({message:'connect oke'})
// })
// app.get('/attribute', async(req,res) => {
//     const browser = await puppeteer.launch({
//         headless: false
//     });
//     const page = await browser.newPage();
//     await page.goto('https://app.smartr.vn')
//     const v = await page.$eval("#radix-\:Reckt36\:-content-personalized > div > article:nth-child(1) > section.flex.flex-col.gap-2.sm\:gap-4 > div.flex.flex-col.gap-4.md\:gap-5.w-full > div > div.w-full.rounded-xl.md\:rounded-lg.bg-gray-100.dark\:bg-gray-900.relative.cursor-pointer.md\:basis-\[180px\].md\:h-\[108px\].md\:shrink-0 > div.hidden.md\:block.w-full.h-full > a > span > img", element=> element.getAttribute("src"))
//     console.log("🚀 ===== app.get ===== t:", v);
//     return res.json({message:'connect oke'})
// })
app.listen(3000, () => {
    console.log('url',process.env.DATABASE_URL)
   console.log('Server start at 3000') 
})