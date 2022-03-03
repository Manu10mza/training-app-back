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
>>>>>>> ad4bbad8bfbfe5574286b964866fd3b8614f069a
});
