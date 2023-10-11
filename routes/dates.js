const express = require('express')
const moment = require('moment-timezone')
const router = express.Router()

function getDates() {
    let Dates = []
    
    const now = moment.tz('Pacific/Auckland')
    
    if(now.hour() >= 20 || (now.hour() === 19 && now.minute() > 50)) {
        now.add(1, 'd')
    }
    
    for(let i = 0; i <= 7; i++) {
        if(now.format('ddd') !== "Sun") {
            Dates.push(now.startOf('day').format('YYYY-MM-DD HH:mm'))
        }

        now.add(1, 'd')
    }

    return Dates
}

router.get('/', (req, res) => {
    const Dates = getDates()
    res.json(Dates)
})

module.exports = router