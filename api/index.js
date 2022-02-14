const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes/routes.js");

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((error) => console.log(error));

// app.use("/api", routes);

app.listen(process.env.PORT || 8200, () => {
  console.log("Server on port 8200");
});
