const jwt = require('jsonwebtoken') //REQUIRE JSON WEB TOKEN PARA CREAR TOKEN DE AUTHORIZACION


const verifyToken = (req,res,next) =>{
      const token = req.headers.token;
      if(token){
            const decoded = jwt.verify(token, process.env.JWT_KEY)
            console.log(decoded)
            next()
      }else{
            res.status(400).json({error: "You no have permission"})
      }
};



module.exports = {
      verifyToken
}