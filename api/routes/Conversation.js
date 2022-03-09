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

router.get('/:userId', async (req,res)=>{
    try{
        const conversation = await Conversation.find({
            members: {$in:[req.params.userId]}
        })
        res.status(200).json(conversation)
    }
    catch(err){
        res.status(500).json(err)
    }
})

router.get('/find/:senderId/:receiverId', async (req,res)=>{
    try{
        const conversation = await Conversation.findOne({
            members: {$all:[req.params.senderId, req.params.receiverId]}
        })
        res.status(200).json(conversation)
    }
    catch(err){
        res.status(500).json(null)
    }
})

module.exports = router