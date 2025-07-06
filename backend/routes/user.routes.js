import express from 'express'

const getallrouter = express.Router()

getallrouter.get('/unlogged',(req,res)=>{
    res.json({message:"you are about to get all public info"})
})


export default getallrouter