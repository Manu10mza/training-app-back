const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY)
const Diet = require('../db.js').models.Diet;
const Routine = require('../db.js').models.Routine;
const Transaction = require('../db.js').models.Transaction;
const User = require('../db.js').models.User;
const ProductClients = require ('../db.js').models.ProductClients;
const { verifyToken } = require('../controllers/verifyToken');


//GENERA UNA NUEVA TRANSACCION
router.post("/:productId/:userId", async (req, res) => {
    const { productId, userId } = req.params;
    const { amount, method, receipt } = req.body;
    let finding, productType;
    //Buscamos el producto
    await Promise.all([Routine, Diet].map(async (e,i)=>
        {
            let a=await e.findOne({
                where: {
                    id: productId
                }
            })
            if(a){
                finding=a
                productType=['Routine','Diet'][i]
            }
            return e
        }
    ))

    if (!finding) return res.status(400).json({ error: 'Product not found.' });
    const product = finding.dataValues;
    //Buscamos al dueño del producto
    
    const userOwner = await User.findOne({
        where: {
            id: product.owner
        }
    });
    if (!userOwner) return res.status(400).json({ error: 'Owner not found.' });
    const userClient = await User.findOne({
        where: {
            id: userId
        }
    }).catch(err => console.log(err));
    if (!userClient) return res.status(400).json({ error: 'User not found.' });
    try {
        const transaction = await Transaction.create({
            productId: productId,
            amount: amount,
            method: method,
            receipt: receipt,
        });

        await userClient.addTransaction(transaction.id);
        await userOwner.addTransaction(transaction.id);

        await ProductClients.findOrCreate({ // Carga una lista de productos - clientes
            where:{ productId },
            defaults:{
                productId,
                ownerId:product.owner,
                clientsData: [{id:userClient.id, username:userClient.username, image:(userClient.image||null)}]
            }
        }).then(([product, firstPurchase])=>{
            if(product&&!firstPurchase){
                if(!product.clientsData.find(e=>e.id===userClient.id)){
                    let newClient = {id:userClient.id, username:userClient.username, image:(userClient.image||null)}
                    product.update({
                        clientsData: [...product.clientsData, newClient]
                    })
                }
                console.log(product)
            }
        })
        
        productType === "Routine" ? await userClient.addRoutine(product.id) : await userClient.addDiet(product.id);
        return res.status(200).json({ success: transaction, clientList:[await ProductClients.findOne({where:{productId}})]});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

//OBTIENE LOS USUARIOS QUE COMPRARON CIERTO PRODUCTO
// router.get('/users/:productId', async (req, res) => {
//     const { productId } = req.params;
//     let users = await User.findAll({
//         include: {
//             model: Transaction,
//             where: {
//                 product: productId,
//                 isSold: false
//             }
//         }
//     });
//     users = users.filter(user => user.Transactions.length).map(user => { return { name: user.username, avatar: user.profile_img } });
//     res.status(200).send(users);
// });


//OBTIENE EL HISTORIAL DE LAS TRANSACCIONES
router.get("/history/:userId", verifyToken, async (req, res) => {
    const { userId } = req.params;
    const user = await User.findOne({
        include: Transaction,
        where: {
            id: userId
        }
    });
    if (!user) return res.status(400).json({ error: 'User not found' });
    res.status(200).send({
        id: user.id, 
        username: user.username, 
        image: user.profile_img, 
        transactions: user.Transactions
    })
});

//OBTIENE EL HISTORIAL DE CLIENTES DE UN PROFESIONAL
router.get("/clients/:profId", async (req, res) => { // Si se le pasa solo el id del profesional, devuelve todos sus clientes.
    const { profId } = req.params;                   // Si se le pasa productId, devuelve el nombre y ID del producto, y los clientes de solo ese producto
    const { productId } = req.query;
    const Owner = await User.findOne({
        include: Transaction,
        where: {
            id: profId
        }
    });

    if (!Owner) return res.status(400).json({ error: 'User not found' });
    
    let product = await ProductClients.findAll({where:{ownerId:profId}})

    if(!product) return res.status(400).json({ error: 'This user has no registered products' });

    if(!product.find(e=>e.clientsData.length)) return res.status(400).json({ error: 'This user has no registered sales' });

    if(!ProductClients.findAll({where:{productId}})) return res.status(400).json({ error: 'No product found matching the given ID' });

    console.log(product)

    let finding

    if(productId)
        await Promise.all([Routine, Diet].map(async (e,i)=>
            {
                let a=await e.findOne({
                    where: {
                        id: productId
                    }
                })
                if(a) finding=a
                return e
            }
        ))
    let clientArray=[]

    let allClients = productId
    ?product.filter(e=>e.productId===productId).map(e=>({id:finding.id, title:finding.title, clients:[...e.clientsData]}))
    :product.map(e=>e.clientsData).flat()

    res.status(200).json({ allClients })
});


//NUEVA COMPRA
router.post('/payment', verifyToken, (req, res) => {
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