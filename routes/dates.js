const express = require('express')
const moment = require('moment')
const router = express.Router()

function getDates() {
    let Dates = []
    
    const now = moment()
    let i = 0
    
    if(now.hour() > 20 || (now.hour() === 20 && now.minute() > 15)) {
        i = 1
    }
    
    for(i; i <= 7; i++) {
        if(moment().add(i, 'd').format('ddd') !== "Sun") {
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