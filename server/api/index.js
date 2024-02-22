const express = require('express')
const puppeteer = require('puppeteer')
const { v4: uuidv4 } = require('uuid');
const http = require('http')
const socketIO = require('socket.io')


const app = express()
const cors = require('cors')
const queryType = require('query-types');
const cookieParser = require('cookie-parser')
const passport = require('passport');
const session = require('express-session')
// const {connect} = require('../core/socket')

const workflowRouter = require('../routes/workflows')
const tableRouter = require('../routes/tables')
const authRouter = require('../routes/auth');
const userRouter = require('../routes/users');
const processRouter = require('../routes/process');
const { auth } = require('../middlewares/auth');
require('dotenv').config()
require('../config/passport')

const server = http.createServer(app)
const io = socketIO(server, {cors: {origin: "*"}});

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
// connect(server);


io.on('connection', (socket) => {
    console.log("Connected succesfully to the socket ...");
});

server.listen(3000, () => {
    console.log('url',process.env.DATABASE_URL)
   console.log('Server start at 3000') 
})