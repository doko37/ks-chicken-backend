const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    // fname: {
    //     type: String,
    //     required: true
    // },
    // lname: {
    //     type: String,
    //     required: true
    // },
    // phNo: {
    //     type: String,
    //     required: true
    // },
    // email: {
    //     type: String,
    //     required: true
    // },
    password: {
        type: String,
        required: false
    },
    isGuest: {
        type: Boolean,
        default: true,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    cart: {
        items: [],
        numItems: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        }
    }
})

const UserModel = mongoose.model("User", UserSchema)
module.exports = UserModel