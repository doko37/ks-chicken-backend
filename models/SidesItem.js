const mongoose = require('mongoose')

const SidesItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    medium_price: {
        type: Number,
        required: false
    },
    large_price: {
        type: Number,
        required: false
    },
    price: {
        type: Number,
        required: false
    },
    key: {
        type: String,
        required: true,
        unique: true
    },
    img: {
        type: String,
        required: false
    }
})


const SidesItemModel = mongoose.model("SideItem", SidesItemSchema)
module.exports = SidesItemModel