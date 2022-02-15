const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const db = require('./db');
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

db.sync({force:true})
  .then(()=>{
    app.listen(process.env.PORT || 8200, () => {
      console.log("Server on port 8200");
    });
  })


