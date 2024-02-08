const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: false
    },
    lname: {
        type: String,
        required: false
    },
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
        numHalfs: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        }
    },
    expiresAfter: {
        type: Date,
        required: false
    }
})

const UserModel = mongoose.model("User", UserSchema)
module.exports = UserModel