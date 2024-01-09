const express = require('express')
const moment = require('moment-timezone')
const router = express.Router()
const StoreHours = require('../models/StoreHours')
const { verifyTokenAndAdmin } = require('./verifyToken')

function getDates() {
    let Dates = []

    const now = moment.tz('Pacific/Auckland')

    if (now.hour() >= 20 || (now.hour() === 19 && now.minute() >= 50)) {
        now.add(1, 'd')
    }

    for (let i = 0; i <= 7; i++) {
        if (now.format('ddd') !== "Sun") {
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

router.post('/storeHours', verifyTokenAndAdmin, async (req, res) => {
    try {
        let startDate = moment(req.body.startDate).startOf('d')
        let endDate = moment(req.body.endDate).startOf('d')

        while (startDate.valueOf() <= endDate.valueOf()) {
            await StoreHours.create({
                date: startDate.format('YYYY-MM-DD'),
                closed: true,
                expiresAfter: moment(startDate).add(1, 'd').toDate()
            })
            startDate.add(1, 'd')
        }

        res.status(200).json("Store Hours have been added.")
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/storeHours/today', async (req, res) => {
    try {
        const now = moment.tz('Pacific/Auckland').format('YYYY-MM-DD')
        const today = await StoreHours.findOne({ date: now })
        if (today === null) res.status(200).json({ closed: false })
        else res.status(200).json({ closed: true })
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/storeHours', verifyTokenAndAdmin, async (req, res) => {
    try {
        const hours = await StoreHours.find()
        res.status(200).json(hours)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.delete('/storeHours', verifyTokenAndAdmin, async (req, res) => {
    try {
        await StoreHours.deleteMany({ date: req.body.date })
        res.status(200).json(`Deleted store hour at ${req.body.date}`)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router