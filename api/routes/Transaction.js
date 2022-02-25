const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY)
const Diet = require('../db.js').models.Diet;
const Routine = require('../db.js').models.Routine;
const Transaction = require('../db.js').models.Transaction;
const User = require('../db.js').models.User;
const { verifyToken } = require('../controllers/verifyToken');


//GENERA UNA NUEVA TRANSACCION
router.post("/:productId/:userId", verifyToken, async (req, res) => {
    const { productId, userId } = req.params;
    const { bill } = req.body;
    let finding;

    //Buscamos el producto
    finding = await Routine.findOne({
        where:{
            id : productId
        }
    });

    if(!finding){
        finding = await Diet.findOne({
            where:{
                id : productId
            }
        });
    }

    if(!finding) return res.status(400).json({error: 'Product not found'});
    const product = finding.dataValues;

    //Buscamos al dueño del producto
    const userOwner = await User.findOne({
        where:{
            id : product.owner
        }
    });
    if(!userOwner) return res.status(400).json({error: 'Owner not found'});

    const userClient = await User.findOne({
        where:{
            id : userId
        }
    });

    if(!userClient) return res.status(400).json({error: 'User not found'});

    try {
        const transactionClient = await Transaction.create({
            amount : product.price,
            product : product.id,
            bill
        });
        const transactionOwner = await Transaction.create({
            amount : product.price,
            product : product.id,
            isSold: true,
            bill
        });
    
        await userClient.addTransaction(transactionClient.id);
        await userOwner.addTransaction(transactionOwner.id);
        
        return res.status(200).json({success: 'Transaction successfuly'});
    } catch (error) {
        return res.status(400).json(error);
    }
});


//OBTIENE EL HISTORIAL DE LAS TRANSACCIONES
router.get("/history/:userId", verifyToken, async (req, res) => {
    console.log('holis');
    const { userId } = req.params;
    const user = await User.findOne({
        include : Transaction,
        where:{
            id: userId
        }
    });

    if(!user) return res.status(400).json({error: 'User not found'});

    console.log(user.dataValues.Transactions)

    res.status(200).send(user.dataValues.Transactions)


    // try {
    //     const { userId } = req.params;
    //     //Se comprueba si falta algun dato obligatorio o el UUID no es válida
    //     const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    //     if (!isUUID.test(userId)) return res.status(400).send({error: "UUID not valid"})

    //     //Se busca el usuario
    //     let user= await User.findOne({
    //         include: Transaction,
    //         where: {
    //             id: userId,
    //         }
    //     })
    //     console.log(user.dataValues.Transactions)
    //     if(user.length===0) return res.status(400).send({error: "User with UUID not found"})

    //     //Se buscan las transacciones hechas por el usuario
    //     if(user) res.status(200).send(user.dataValues);

    //     else return res.status(400).send({error: "User not found"})
    // } catch (error) {
    //     console.log(error);
    //     res.status(400).json({ error: error.message });
    // }
});


//NUEVA COMPRA
router.post('/payment', verifyToken ,(req, res) => {
    stripe.charges.create(
        {
            source: req.body.tokenId,
            amount: req.body.amount,
            currency: "usd",
        },
        (stripeErr, stripeRes) => {
            if (stripeErr) {
                res.status(200).json(stripeErr);
            } else {
                res.status(500).json(stripeRes);
            }
        }
    )
})


module.exports = router;