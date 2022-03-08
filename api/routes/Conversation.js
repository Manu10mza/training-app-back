const router = require('express').Router()
const Conversation = require('../models/Conversation')

router.post('/', async (req,res)=>{
    const newConversation = new Conversation({members:[req.body.senderId, req.body.receiverId]})
    try{
        const saveConversation = await newConversation.save()
        res.status(200).json(saveConversation)
    }
    catch(err){
        res.status(500).json(err)
    }
})

module.exports = router