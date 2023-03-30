const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    items: []
})

const CartModel = mongoose.model("Cart", CartSchema)
module.exports = CartModel