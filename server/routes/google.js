const { v4: uuidv4 } = require('uuid');
const express = require('express')

const router = express.Router()
const { prisma } = require('../config/prisma');
const { getToken, setCredentials, driveUpload } = require('../utils/google');

router.get('/callback', async (req, res) => {
    const {code, state} = req.query
    console.log("🚀 ===== router.get ===== state:", state);
    console.log("🚀 ===== router.get ===== code:", code);
    const userId = state.split('=')[1]
    const tokens = await getToken(code)
    console.log("🚀 ===== router.get ===== tokens:", tokens);
// fs.writeFileSync('token.json', JSON.stringify(tokens))
// const connection=await prisma.connection.create({
//   data:{
//     uuid: uuidv4(),
//     provider:'google',
//     profile:{},
//     token: tokens,
//   },
// })
await prisma.users.update({
  where:{
    id: parseInt(userId, 10)
  },
  data:{
    connection:{
      create:{
        uuid: uuidv4(),
        provider:'google',
        profile:{},
        token: tokens,
      }
    }
  },
  include:{
    connection:true
  }
})
// console.log("🚀 ===== app.get ===== connection:", connection);
// oauth2Client.setCredentials( tokens);
setCredentials(tokens)
res.redirect('http://localhost:5173/connections')

})
router.get('/upload', async (req,res) => {
    const connection = await prisma.connection.findFirst()
    const {token} = connection
    const data = await driveUpload(token,stream)
    res.json({data})
})
module.exports = router