const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY)
const Diet = require('../db.js').models.Diet;
const Routine = require('../db.js').models.Routine;
const Transaction = require('../db.js').models.Transaction;
const User = require('../db.js').models.User;
const { verifyPTrainerToken } = require('../controllers/verifyToken');


//GENERA UNA NUEVA TRANSACCION
router.post("/:productId/:userId", verifyPTrainerToken, async (req, res) => {
    try {
        const { productId, userId } = req.params;
        const { isSell, isSold, amount } = req.body;
        
        //Se comprueba si falta algun dato obligatorio o el UUID no es válida
        const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!amount) return res.status(400).send({error: "Missing required data"})
        if (!isUUID.test(productId) || !isUUID.test(userId)) return res.status(400).send({error: "UUID not valid"})

        //Se busca el producto y comprueba si es una dieta o rutina
        let product;
        const routine = await Routine.findByPk(productId);
        const diet = await Diet.findByPk(productId);

        if (!routine && !diet) return res.status(400).send({error: "Diet or Routine not found"})

        if (routine) product = routine;
        else product = diet;

        //Se crea la transacción y se relaciona con el usuario
        const transaction= await Transaction.create({amount,isSell,isSold,product});
        const user= await User.findByPk(userId);
        if(!user) return res.status(400).send({error: "User with UUID not found"})
        user.addTransaction(transaction.id);
        res.status(200).send(transaction);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});


//OBTIENE EL HISTORIAL DE LAS TRANSACCIONES
router.get("/history/:userId", verifyPTrainerToken, async (req, res) => {
    try {
        const { userId } = req.params;
        //Se comprueba si falta algun dato obligatorio o el UUID no es válida
        const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!isUUID.test(userId)) return res.status(400).send({error: "UUID not valid"})
        //Se busca el usuario
        let user= await User.findAll({
            include: Transaction,
            where: {
                id: userId,
            }
        })
        if(user.length===0) return res.status(400).send({error: "User with UUID not found"})
        //Se buscan las transacciones hechas por el usuario
        if (user) res.status(200).send(user[0].dataValues.Transaction);
        else return res.status(400).send({error: "User not found"})
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});


//NUEVA COMPRA
router.post('/payment', (req, res) => {
    stripe.charges.create(
        {
            source: req.body.tokenId,
            amount: req.body.amount,
            currency: "usd",
        },
        (stripeErr, stripeRes) => {
            if (stripeErr) {
                res.status(500).json(stripeErr);
            } else {
                res.status(500).json(stripeRes);
            }
        }
    )
})


module.exports = router;