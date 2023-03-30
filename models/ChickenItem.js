const mongoose = require('mongoose')
ToppingSchema = require('./Topping')

const ChickenItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    half_price: {
        type: Number,
        required: true
    },
    full_price: {
        type: Number,
        required: true
    },
    key: {
        type: String,
        required: true,
        unique: true
    },
    img: {
        type: String,
        required: false
    }
})


const ChickenItemModel = mongoose.model("ChickenItem", ChickenItemSchema)
module.exports = ChickenItemModel