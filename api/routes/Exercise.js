const router = require('express').Router();
const Exercise = require('../db.js').models.Exercise;

router.post("/",async (req,res)=>{
    try {
        const {title,description,video}=req.body;
        if(!title||!description||!video){
            res.status(400).json({error:"Missing required data"});
        };

        const newExercise= await Exercise.create({title,description,video});
        res.status(200).send(newExercise);
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"Missing required data"});
    }
});


router.get('/', async (req,res)=>{
    const exercises = await Exercise.findAll();
    res.status(200).json(exercises);
});


router.get('/:id', async (req,res)=>{
    const { id } = req.params;
    try{
        let result = await Exercise.findAll({
            where:{
                id
            }
        });
        return res.status(200).json(result);

    } catch(error) {
        return res.status(400).json({error});
    }
});

module.exports = router;