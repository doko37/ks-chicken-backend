const express = require('express')
const moment = require('moment')
const router = express.Router()

Dates = []

for(let i = moment().add(15, 'm').hour() > 19 ? 1 : 0; i <= 7; i++) {
    if(moment().add(i, 'd').format('ddd') !== "Sun") {
        Dates.push(moment().add(i, 'd'))
    }
}

router.get('/', (req, res) => {
    res.json(Dates)
})

module.exports = router