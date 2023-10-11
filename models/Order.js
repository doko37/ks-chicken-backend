const mongoose = require('mongoose')
const UserModel = require('./User')

const OrderSchema = new mongoose.Schema({
    user: {
        type: Object,
        required: true
    },
    pickupDate: {
        type: String,
        required: true
    },
    pickupTime: {
        type: String,
        required: true
    },
    orderNo: {
        type: String,
        required: true
    }
})


const OrderModel = mongoose.model("Order", OrderSchema)
module.exports = OrderModel