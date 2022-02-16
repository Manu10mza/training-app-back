const router = require('express').Router();
const Exercise = require('../db.js').models.Exercise;

router.post("/",async (req,res)=>{
    try {
        const {title,description,video}=req.body;
        if(!title||!description||!video){
            throw new Error("Missing required data")
        }
        const newExercise=await Exercise.create({title,description,video});
        res.status(200).send(newExercise);
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"Missing required data"});
    }
})
module.exports = router;