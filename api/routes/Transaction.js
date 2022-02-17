const router = require('express').Router();
const Diets = require('../db.js').models.Diets;
const Rutines = require('../db.js').models.Rutines;
const Transactions = require('../db.js').models.Transactions;
const User = require('../db.js').models.User;

router.post("/:productId/:userId",async (req,res)=>{
    try {
        const {productId, userId}=req.params;
        const {isSell,isSold, amount}=req.body;

        //Se comprueba si falta algun dato obligatorio o el UUID no es válida
        const isUUID=/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!amount) throw new Error("Missing required data");
        if(!isUUID.test(productId)||!isUUID.test(userId)) throw new Error("UUID not valid");

        //Se busca el producto y comprueba si es una dieta o rutina
        let product;
        const rutine= await Rutines.findByPk(productId);
        const diet= await Diets.findByPk(productId);

        if (!rutine||!diet) throw new Error("Diet or Rutine not found");

        if(rutine) product=rutine;
        else product=diet;

        //Se crea la transacción y se relaciona con el usuario
        const transaction= await Transactions.create({amount,isSell,isSold,product});
        const user= await User.findByPk(userId);
        user.addTransaction(transaction.id);
        res.status(200).send(transaction);

    } catch (error) {
        console.log(error);
        res.status(400).json({error:error.message});
    }
})
module.exports = router;