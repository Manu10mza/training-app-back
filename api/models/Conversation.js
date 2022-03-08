const mongoose = require("mongoose")

const ConversationSchema = new mongoose.Schema(
    {
        members:{
            type: Array
        }
    },
    {
        timeStamp: true
    }
)

module.exports = mongoose.model("Convertacion", ConversationSchema)