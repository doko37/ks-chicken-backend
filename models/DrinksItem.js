const mongoose = require('mongoose')

const DrinksItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true

    },
    size: {
        type: Array,
        required: false
    },
    drinks: {
        type: Array,
        required: false
    },
    key: {
        type: String,
        required: true
    }
})


const DrinksItemModel = mongoose.model("DrinksItem", DrinksItemSchema)
module.exports = DrinksItemModel