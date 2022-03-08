const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const db = require("./db");
const router = require("./routes/routes");
const app = express();
const mongoose = require('mongoose')

dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/api", router);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true } ).then(()=>console.log("Base del chat on")).catch(err=>console.log(err))

db.sync({ force: false }).then(() => {
    app.listen(process.env.PORT || 8200, () => {
        console.log("Server on port 8200");
    });
});
