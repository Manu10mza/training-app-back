const router = require('express').Router();
const Exercise = require('../db.js').models.Rutines;



router.post("/",async (req,res)=>{
    try {
        const {title,description,video}=req.body;
        if(!title||!description||!video){
            throw new Error("Missing required data")
        }
        const newExercise=await Exercise.create({title,description,video});
        res.send(newExercise);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})
module.exports = router;