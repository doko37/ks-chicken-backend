const mongoose = require("mongoose")

const ToppingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    include: {
        type: Boolean,
        required: true
    }
})


const ToppingModel = mongoose.model("Topping", ToppingSchema)
module.exports = ToppingModel