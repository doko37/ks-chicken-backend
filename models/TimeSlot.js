const mongoose = require('mongoose')

const TimeSlotSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        required: true
    }
})


const TimeSlotModel  = mongoose.model("TimeSlot", TimeSlotSchema)
module.exports = TimeSlotModel 