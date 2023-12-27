const mongoose = require('mongoose')

const StoreHoursSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    closed: {
        type: Boolean,
        required: true
    },
    expiresAfter: {
        type: Date,
        required: true
    }
})


const StoreHoursModel = mongoose.model("StoreHours", StoreHoursSchema)
module.exports = StoreHoursModel 