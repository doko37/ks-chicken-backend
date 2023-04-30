const mongoose = require('mongoose')
const UserModel = require('./User')

const OrderSchema = new mongoose.Schema({
    user: {
        type: Object,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
})


const OrderModel = mongoose.model("Order", OrderSchema)
module.exports = OrderModel