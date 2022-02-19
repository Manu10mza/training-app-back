const router = require('express').Router();
const Routine = require('../db.js').models.Routine;
const {verifyPTrainerToken} = require('../controllers/verifyToken');

router.post("/:ownerId",verifyPTrainerToken,async (req,res)=>{
    try {
        const {title,exercises,price}=req.body;
        const {ownerId}=req.params;

        //Se verifica si falta algun dato necesario
        if(!title||!exercises||!ownerId||!price){
            throw new Error("Missing required data")
        }

        //Se verifica si el arreglo exercises tiene la forma correcta
        if(exercises.length!==7) throw new Error("Array length should be 7 (at least one exercise per day, or Null on some day with no exercise)");
        if(!Array.isArray(exercises[0])) throw new Error("Invalid exercise; Ej:[[{Exercise1-Monday},{Exercise2-Monday}],[{Exercise1-Tuesday},{Exercise2-Tuesday}]...]");

        //Comprobación del precio (price>=0 y debe ser un número)
        if(isNaN(price*1)||(price<0)) throw new Error("Invalid price")

        //Se guardan los ejercicios correspondientes a cada día de la semana
        let weekDays=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
        const days={};
        exercises.forEach((e,i)=>{
            if(e){
                days[weekDays[i]]=e;
            } 
        })

        const newRutine=await Routine.create({title,owner:ownerId,days,price});
        res.status(200).send(newRutine);
    } catch (error) {
        console.log(error);
        res.status(400).json({error:error.message});
    }
})

router.put("/update/:ownerId/:rutineId",verifyPTrainerToken,async (req,res)=>{
    try {
        let {value}=req.body;
        const {ownerId, rutineId}=req.params;
        let weekDays=[];
        let days={};
        let updateValue={};  //Objeto que tendrá los valores a actualizar

        //Se busca la rutina a actualizar
        let rutine=await Routine.findByPk(rutineId).then(r => r.dataValues).catch((e)=>"Routine not found");

        //Se compruebba si el usuario es el creador de la rutina
        if(rutine.owner!==ownerId) throw new Error("The user is not the creator of the routine");

        //Se lee el objeto value y se comprueba si alguna propiedad enviada no existe en el modelo
        for (const key in value) {
            if((!rutine[key])&&key!=="exercises") throw new Error(`Invalid field name -> ${key}`)
            //El Owner no puede cambiarse
            if(key==="owner"){
                throw new Error("The owner cannot be changed")
            }
        }

        //Se verifica que el arreglo exercise tiene la forma correcta
        if(value.exercises&&Array.isArray(value.exercises[0])){
            if(value.exercises.length!==7) throw new Error("Array length should be 7 (at least one exercise per day, or Null on some day with no exercise)");
            weekDays=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
            days={};
            //Guardo los datos por día de la semana
            value.exercises.forEach((e,i)=>{
                if(e){
                    days[weekDays[i]]=e;
                } 
            })
            value.days="days";
            updateValue.days=days;
            //Si entra al próximo if es por que exercise no tenia la forma correcta
        } else if(value.exercises) throw new Error("Invalid exercise; Ej:[[{Exercise1-Monday},{Exercise2-Monday}],[{Exercise1-Tuesday},{Exercise2-Tuesday}]...]");

        //Se verifica si el precio es valido
        if(value.price&&!isNaN(value.price*1)&&value.price>=0) updateValue.price=value.price;
        if(value.title) updateValue.title=value.title;

        let updateSucess;
        //Se itera por todo el objeto value y se actualiza en la base de datos
        for (const key in value) {
            if(key!=="exercises"){
                updateSucess=await Routine.update({
                    [key]: updateValue[key]
                }, {
                    where: {
                    id: rutineId
                    }
                })
                if(!updateSucess) throw new Error("Error updating routine")
            }
        }
        const rutineUpdated=await Routine.findByPk(rutineId);
        res.status(200).send(rutineUpdated);
    } catch (error) {
        console.log(error);
        res.status(400).json({error:error.message});
    }
})

//TRAER TODAS LAS RUTINAS DE LA DB
router.get('/', async (req, res)=>{
    const result = await Routine.findAll();
    res.status(200).json(result);
});

module.exports = router;