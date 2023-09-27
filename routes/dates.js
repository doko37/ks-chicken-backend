const express = require('express')
const moment = require('moment-timezone')
const router = express.Router()

function getDates() {
    let Dates = []
    
    const now = moment.tz('Pacific/Auckland')
    let i = 0
    
    if(now.hour() >= 20 || (now.hour() === 19 && now.minute() > 50)) {
        i = 1
    }
    
    for(i; i <= 7; i++) {
        if(now.add(i, 'd').format('ddd') !== "Sun") {
            Dates.push(moment().startOf('day').add(i, 'd').format('YYYY-MM-DD HH:mm'))
        }
    }

    return Dates
}

router.get('/', (req, res) => {
    const Dates = getDates()
    res.json(Dates)
})

module.exports = router