const router = require('express').Router();
const Diets = require('../db.js').models.Diets;
const Rutines = require('../db.js').models.Rutines;
const Transactions = require('../db.js').models.Transactions;

router.post("/:productId",async (req,res)=>{
    try {
        const {productId}=req.params;
        const {isSell,isSold, amount}=req.body;

        const isUUID=/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(productId)
        if (!amount) throw new Error("Missing required data")
        if(!isUUID) throw new Error("UUID not valid")

        let product;
        const rutine= await Rutines.findByPk(productId);
        const diet= await Diets.findByPk(productId);

        if (!rutine||!amount) throw new Error("Diet or Rutine not found")

        if(rutine) product=rutine;
        else product=diet;

        const transaction= await Transactions.create({amount,isSell,isSold,product})
        res.status(200).send(transaction);

    } catch (error) {
        console.log(error);
        res.status(400).json({error:error.message});
    }
})
module.exports = router;