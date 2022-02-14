const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes/routes.js");

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());


app.listen(process.env.PORT || 8200, () => {
  console.log("Server on port 8200");
});
