const express = require('express')
const moment = require('moment')
const router = express.Router()

let time = []

function createArray() {
    time = []
    const increment = 5
    let i = 0

    while (moment().hour(11).minute(0).add(increment * i, 'm').hour() < 20) {
        if (moment().day() === 0) {
            time.push(moment().hour(11).minute(0).add(increment * i, 'm').format())
        } else {
            if (moment().hour() === moment().hour(11).minute(0).add(increment * i, 'm').hour()) {
                if (!(moment().minute() + 15 >= moment().hour(11).minute(0).add(increment * i, 'm').minute())) {
                    time.push(moment().hour(11).minute(0).add(increment * i, 'm').format())
                }
            } else if (moment().hour() + 1 === moment().hour(11).minute(0).add(increment * i, 'm').hour()) {
                time.push(moment().hour(11).minute(0).add(increment * i, 'm').format())
            } else if (!(moment().hour() > moment().hour(11).minute(0).add(increment * i, 'm').hour())) {
                time.push(moment().hour(11).minute(0).add(increment * i, 'm').format())
            } else if (moment().hour() > 19) {
                time.push(moment().hour(11).minute(0).add(increment * i, 'm').format())
            }
        }

        i++
    }
}

createArray()


setInterval(createArray, 60000)

router.get('/', (req, res) => {
    res.json(time)
})

module.exports = router