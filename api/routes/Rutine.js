const router = require('express').Router();
const Rutines = require('../db.js').models.Rutines;
const {verifyPTrainerToken} = require('../controllers/verifyToken');

router.post("/:ownerId", verifyPTrainerToken ,async (req,res)=>{
    try {
        const {title,exercises,amount}=req.body;
        const {ownerId}=req.params;
        if(!title||!exercises||!ownerId||!amount){
            throw new Error("Missing required data")
        }
        let weekDays=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
        const days={};
        exercises.forEach((e,i)=>{
            if(e){
                days[weekDays[i]]=e;
            } 
        })
        const newRutine=await Rutines.create({title,owner:ownerId,days,amount});
        res.status(200).send(newRutine);
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"Missing required data"});
    }
})
module.exports = router;