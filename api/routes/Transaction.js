const router = require('express').Router();
const Diets = require('../db.js').models.Diet;
const Rutines = require('../db.js').models.Rutines;
const Transactions = require('../db.js').models.Transactions;
const User = require('../db.js').models.User;
const {verifyPTrainerToken} = require('../controllers/verifyToken');

router.post("/:productId/:userId",verifyPTrainerToken,async (req,res)=>{
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

        if (!rutine && !diet) throw new Error("Diet or Rutine not found");

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

router.get("/history/:userId",verifyPTrainerToken,async (req,res)=>{
    try {
        const {userId}=req.params;
        //Se comprueba si falta algun dato obligatorio o el UUID no es válida
        const isUUID=/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if(!isUUID.test(userId)) throw new Error("UUID not valid");
        //Se busca el usuario
        let user= await User.findAll({
            include: Transactions,
            where: {
                id: userId,
            }
        })
        //Se buscan las transacciones hechas por el usuario
        if(user) res.status(200).send(user[0].dataValues.Transactions);
        else throw new Error("User not found");
    } catch (error) {
        console.log(error);
        res.status(400).json({error:error.message});
    }
})
router.get('/:userId',verifyPTrainerToken,async(req,res)=>{
    try {
        const {userId}=req.params
        //Se comprueba si falta algun dato obligatorio o el UUID no es válida
        const isUUID=/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if(!isUUID.test(userId)) throw new Error("UUID not valid");
        const user=await User.findOne({
            include: Transactions,
            where: {
                id:userId
            }
        })
        //Se verifica si existe un usuario con esa UUID
        if(!user) throw new Error("User not found")
        //Suma el precio de todos los productos
        let sum=user.dataValues.Transactions.reduce((sum,t)=>{
            return sum+=t.amount*t.product.price
        },0)
        res.status(200).json({money:sum});
    } catch (error) {
        console.log(error);
        res.status(400).json({error:error.message});
    }
})
module.exports = router;