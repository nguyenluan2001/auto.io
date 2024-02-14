const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('../utils/constants')
const { prisma } = require('../config/prisma')

const auth = (req, res, next) => {
    try{
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, JWT_SECRET_KEY, async (error, decoded) => {
        if(error){
            return res.status(403).json({message:'Unauthorized'})
        }
        console.log('decoded', decoded)
        const user = await prisma.users.findUnique({
            where:{
                id: decoded?.id
            }
        })
        if(!user){
            return res.status(403).json({message:'Unauthorized'})
        }
        req.user={
            id: user?.id
        }
        next()
    })

    }catch(error){
            return res.status(403).json({message:'Unauthorized'})
    }
}
module.exports={auth}