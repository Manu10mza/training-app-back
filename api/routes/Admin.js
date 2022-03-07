const router = require('express').Router();
const sequelize = require('../db');
const { User, Recipe, Diet, Exercise, Routine, Transaction } = sequelize.models;
const { verifyAdminToken } = require('../controllers/verifyToken');

let result=[User, Recipe, Routine, Exercise, Diet];

router.get('/orders', verifyAdminToken, async (req, res) => {
    try {
        const allOrders = await Transaction.findAll()
        res.status(200).json(allOrders)
    } catch (error) {
        res.status(500).json(error)
    }
})


//TRAER ESTADÍSTICAS MENSUAL DE DETERMINADO PRODUCTO
router.get('/stats/:type', verifyAdminToken, async (req, res) => {
    const { type } = req.params
    let mapType

    if(!type) return res.status(400).json({ error: 'No product type was received' })

    if (type === 'transactions') mapType = await Transaction.findAll();

    if (type === 'users') mapType = await User.findAll()

    if (type === 'nutritionists')
        mapType = await User.findAll({
            where: {
                is_nutritionist: true
            }
        });

    if (type === 'trainers')
        mapType = await User.findAll({
            where: {
                is_personal_trainer: true
            }
        });

    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Agu","Sep","Oct","Nov","Dec"]

    let result = {}

    mapType.map(e => {
        let month = e.createdAt.toString().split(' ')[1]
        result.hasOwnProperty(month) ? result[month] += 1 : result[month] = 1
    })
    let sorted = [...Object.keys(result)].sort((a, b) => months.indexOf(a) - months.indexOf(b))
    let final = {}
    sorted.map(e => { final[e] = result[e] })
    res.json(final)
})


router.get('/products', verifyAdminToken, async (req, res) => {
    const diets = await Diet.findAll();
    const routines = await Routine.findAll();
    res.status(200).json([...diets, ...routines]);
});


//TRAE TODOS LOS USUARIOS CREADOS EN LA BASE DE DATOS
router.get('/users', verifyAdminToken, async (req, res) => {
    const result = await User.findAll();
    res.json(result)
});


//OBTIENE LOS DETALLES DE CUALQUIER COSA DE LA CUAL SE PROPORCIONE EL ID
router.get('/:productId', verifyAdminToken, async (req, res) => {

    for(let i=0;i<result.length;i++){
        let a = result[i].findOne({where:{id:req.params.productId}})
        if(a) return res.status(200).json({success: a})
    };
    
    res.status(400).json({ error: 'No element matched the given ID' });
})


//ALTERNA EL ESTADO DE DESABILITACIÓN DE CUALQUIER OBJETO
router.delete('/:productId', verifyAdminToken, async (req, res) => {

    for(let i=0;i<result.length;i++){
        let a = await result[i].findOne({where:{id:req.params.productId}})
        if(a) {
            a.update({disabled: !a.disabled})
            return res.status(200).json({success: [a.disabled?'Disabled':'Enabled']+' successfuly'})
    }}

    res.status(400).json({ error: 'No element matched the given ID' })
});

module.exports = router