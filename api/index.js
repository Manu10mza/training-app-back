const express = require("express");
const app = express();
const http = require('http')
const server = http.createServer(app)


const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./db");
const router = require("./routes/routes");
const mongoose = require('mongoose');

dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api", router);
mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
    .then(() => console.log("Base del chat on"))
    .catch(err => console.log(err))

const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
})


let users = []

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) &&
        users.push({ userId, socketId })
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}


const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    console.log("a user connected ");

    socket.on("addUser", (userId) => {
        addUser(userId, socket.id)
        io.emit("getUsers, users")
    })

    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        });
    });

    console.log("USERS:", users);

    socket.on("disconnet", () => {
        console.log("a user disconnected!");
        removeUser(socket.id)
        io.emit("getUsers", users)
    })

})


db.sync({ force: false }).then(() => {
    server.listen(process.env.PORT || 8200, () => {
        console.log("Server on port 8200");
    });
});
