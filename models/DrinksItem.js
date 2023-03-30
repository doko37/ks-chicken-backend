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
    key: {
        type: String,
        required: true
    }
})


const DrinksItemModel = mongoose.model("DrinksItem", DrinksItemSchema)
module.exports = SidesItemModel