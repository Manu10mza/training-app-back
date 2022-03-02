const router = require("express").Router();
const axios = require("axios");



router.get('/', async (req, res)=>{
      try {
            let health = await axios.get('https://api.thenewsapi.com/v1/news/top?categories=health&api_token=RzeMHAmRO0IOo8C4pCr5xptReu3BNhfKacS5I5zQ&limit=5&language=en');
            let sports = await axios.get('https://api.thenewsapi.com/v1/news/top?categories=sports&api_token=RzeMHAmRO0IOo8C4pCr5xptReu3BNhfKacS5I5zQ&limit=5&language=en');
            health = health.data.data
            sports = sports.data.data
            
      } catch (error) {
            // console.log(error)
            return res.status(400).json({error})
      }
      
      res.status(200).json({health : health, sports: sports, combined : [...health, ...sports]})
});
module.exports = router;

