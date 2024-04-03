const express = require('express')
const puppeteer = require('puppeteer')
const { v4: uuidv4 } = require('uuid');
const http = require('http')
const socketIO = require('socket.io')

// 
const app = express()
const cors = require('cors')
const queryType = require('query-types');
const cookieParser = require('cookie-parser')
const passport = require('passport');
const session = require('express-session')
// const {connect} = require('../core/socket')

const {google} = require('googleapis');
const fs = require('fs')
const workflowRouter = require('../routes/workflows')
const tableRouter = require('../routes/tables')
const authRouter = require('../routes/auth');
const userRouter = require('../routes/users');
const processRouter = require('../routes/process');
const scheduleRouter = require('../routes/schedule');
const connectionRouter = require('../routes/connection');
const googleRouter = require('../routes/google')
const { auth } = require('../middlewares/auth');
const {job}=require('../core/cronjob');
const { prisma } = require('../config/prisma');
require('dotenv').config()
require('../config/passport')

const server = http.createServer(app)
const io = socketIO(server, {cors: {origin: "*"}});
const CLIENT_ID="469079965579-l704roh952cnfdkok2t1qcm4ue6bcug9.apps.googleusercontent.com"
const CLIENT_SECRET="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"
const REDIRECT_URL="http://localhost:3000/api/google/callback"
// const oauth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URL
// );


// job()
app.set('socket', io);
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


app.use('/api/tables',auth, tableRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', auth, userRouter)
app.use('/api/processes', auth, processRouter)
app.use('/api/workflows', auth, workflowRouter)
app.use('/api/schedules', auth, scheduleRouter)
app.use('/api/connections',auth, connectionRouter)
app.use('/api/google', googleRouter)
// connect(server);


io.on('connection', (socket) => {
    console.log("Connected succesfully to the socket ...");
});

server.listen(3000, () => {
    console.log('url',process.env.DATABASE_URL)
   console.log('Server start at 3000') 
})