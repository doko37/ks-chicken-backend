const express = require('express')
const moment = require('moment-timezone')
const router = express.Router()
const Order = require('../models/Order')

async function countOrders(time) {
    const orders = await Order.find({pickupTime: time.format('H:mm'), pickupDate: time.format('YYYY-MM-DD')})
    
    let count = 0

    for(let i in orders) {
        let cart = orders[i].user.cart

        count += cart.numHalfs
    }

    return count
}

async function createArray(date) {
    let time = []
    const increment = 10
    const closeHour = 20

    const currentTime = moment.tz('Pacific/Auckland').format('HH:mm')
    let orderTime
    if(date === undefined) {
        orderTime = moment.tz('Pacific/Auckland').startOf('d').add(currentTime)
    } else {
        orderTime = moment(date).startOf('d').add(currentTime)
    }
    const splitTime = currentTime.split(':')
    if(date === undefined && (Number(splitTime[0]) >= 20 || Number(splitTime[0]) === 19 && Number(splitTime[1]) > 50 )) orderTime.add(1, 'd')

    
    if(orderTime.hour() >= closeHour) {
        orderTime.hour(11).minute(0)
    } else {
        if((orderTime.hour() === 10 && orderTime.minute() < 50) || orderTime.hour() < 11 || (orderTime.hour() === 19 && orderTime.minute() >= 50)) {
            orderTime.hour(11).minute(0)
        } else {
            const remainder = orderTime.minute() % 10;
            orderTime.add((10 - remainder) + 10, 'm')
        }
    }

    let tempTime = moment(orderTime).hour(20).minute(10)

    let overload = 0
    while(tempTime.subtract(increment, 'm') >= orderTime) {
        if(overload < 0) overload = 0
        if(overload > 0) {
            numHalfs = await countOrders(tempTime)
            time.push({time: tempTime.format('HH:mm'), available: (numHalfs + overload < 4), numHalfs: numHalfs})
            overload -= 4
        } else {
            overload += await countOrders(tempTime)
            time.push({time: tempTime.format('HH:mm'), available: (overload < 4), numHalfs: overload})
            overload -= 4
        }
    }

    return time
}

router.get('/orders', async (req, res) => {
    console.log(req.body.time)
    let numHalfs = await countOrders(moment(req.body.time))

    res.json({numHalfs: numHalfs})
})

router.get('/', async (req, res) => {
    let time = await createArray(req.query.date)

    res.json(time.reverse())
})

module.exports = router