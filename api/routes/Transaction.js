const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY)
const Diet = require('../db.js').models.Diet;
const Routine = require('../db.js').models.Routine;
const Transaction = require('../db.js').models.Transaction;
const User = require('../db.js').models.User;
const { verifyToken } = require('../controllers/verifyToken');


//GENERA UNA NUEVA TRANSACCION
router.post("/:productId/:userId", async (req, res) => {
    const { productId, userId } = req.params;
    const { id, amount, method, receipt } = req.body;
    let finding;
  
    //Buscamos el producto
    finding = await Routine.findOne({
        where:{
            id : productId
        }
    }).catch(err => console.log(err));

    if(!finding){
        productType="Diet"
        finding = await Diet.findOne({
            where:{
                id : productId
            }
        });
    }

    if(!finding) return res.status(400).json({error: 'Product not found.'});
    const product = finding.dataValues;

    //Buscamos al dueño del producto
    const userOwner = await User.findOne({
        where:{
            id : product.owner
        }
    });
    if(!userOwner) return res.status(400).json({error: 'Owner not found.'});
    const userClient = await User.findOne({
        where:{
            id : userId
        }
    }).catch(err => console.log(err));

    if(!userClient) return res.status(400).json({error: 'User not found.'});

    try {
        const transactionClient = await Transaction.create({
            productId : productId,
            amount: amount,
            method: method,
            receipt: receipt,
        });
        await userClient.addTransaction(transactionClient.id);
        productType==="Routine"?await userClient.addRoutine(product.id):await userClient.addDiet(product.id);
        await userOwner.addTransaction(transactionOwner.id);
        
        return res.status(200).json({success: 'Transaction added to the database.'});
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
});

//OBTIENE LOS USUARIOS QUE COMPRARON CIERTO PRODUCTO
router.get('/users/:productId',async(req,res)=>{
    const {productId}=req.params;
    let users=await User.findAll({
        include: {
            model:Transaction,
            where:{
                product: productId,
                isSold: false
            }
        }
    });
    users=users.filter(user=>user.Transactions.length).map(user=>{return {name:user.username,avatar:user.profile_img}});
    res.status(200).send(users);
});


//OBTIENE EL HISTORIAL DE LAS TRANSACCIONES
router.get("/history/:userId", verifyToken, async (req, res) => {
    const { userId } = req.params;
    const user = await User.findOne({
        include : Transaction,
        where:{
            id: userId
        }
    });
    if(!user) return res.status(400).json({error: 'User not found'});
    res.status(200).send(user.dataValues.Transactions)
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
                res.status(500).json(stripeErr);
            } else {
                res.status(200).json(stripeRes);
            }
        }
    )
});
module.exports = router;