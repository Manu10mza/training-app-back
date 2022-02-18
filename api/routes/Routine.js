const router = require('express').Router();
const Routine = require('../db.js').models.Routine;
const { verifyPTrainerToken } = require('../controllers/verifyToken');

router.post("/:ownerId", verifyPTrainerToken, async (req, res) => {
    try {
        const { title, exercises, price } = req.body;
        const { ownerId } = req.params;
        if (!title || !exercises || !ownerId || !price) {
            throw new Error("Missing required data");
        }
        let weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const days = {};
        exercises.forEach((e, i) => {
            if (e) {
                days[weekDays[i]] = e;
            } 
        });
        const newRoutine = await Routine.create({ title, owner: ownerId, days, price });
        res.status(200).send(newRoutine);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Missing required data" });
    }
});

//TRAER TODAS LAS RUTINAS DE LA DB
router.get('/', async (req, res)=>{
    const result = await Routine.findAll();
    res.status(200).json(result);
});

module.exports = router;