const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false
    },
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