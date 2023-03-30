const mongoose = require('mongoose')
const UserModel = require('./User')

const OrderSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    user: {
        type: Object,
        required: true,
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