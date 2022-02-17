const jwt = require('jsonwebtoken') //REQUIRE JSON WEB TOKEN PARA CREAR TOKEN DE AUTHORIZACION

//Verifica que el usuario tenga un token 
const verifyToken = (req,res,next) =>{
      const token = req.headers.token;
      if(token){
            next()
      }else{
            res.status(400).json({error: "You no have permission"})
      }
};

//Verifica que el usario tenga el rol Nutritionist
const verifyNutritionistToken = (req,res,next)=>{
      const token = req.headers.token;
      if(token){
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            if(decoded.role.includes('Nutritionist')){
                  next();
            } else return res.status(401).json({error: 'You are not alowed to do that'})

      } else{
            return res.status(400).json({error:'You did not provide a token!'})
      }
};

//Verifica que el usuario tenga el rol PTrainer
const verifyPTrainerToken = (req,res,next)=>{
      const token = req.headers.token;
      if(token){
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            if(decoded.role.includes('PTrainer')){
                  next();

            } else{
                  return res.status(401).json({error: 'You are not alowed to do that'});
            }
      } else {
            return res.status(400).json({error: 'You did not provide a token!'});
      };
};


module.exports = {
      verifyToken,
      verifyNutritionistToken,
      verifyPTrainerToken
};