const mongoose = require('mongoose')
const UserModel = require('./User')

const CompletedOrderSchema = new mongoose.Schema({
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
    },
    completedAt: {
        type: String,
        required: true
    }
})


const CompletedOrderModel = mongoose.model("CompletedOrder", CompletedOrderSchema)
module.exports = CompletedOrderModel