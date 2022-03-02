const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const db = require("./db");
const router = require("./routes/routes");
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/api", router);

db.sync({ force: false }).then(() => {
<<<<<<< HEAD
    app.listen(process.env.PORT || 8200, () => {
        console.log("Server on port 8200");
    });
=======
  app.listen(process.env.PORT || 8200, () => {
    console.log("Server on port 8200");
  });
>>>>>>> 9d318bc3d6af77fb93206ff60974c9ff7199c611
});
