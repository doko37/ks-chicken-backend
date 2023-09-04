const express = require('express')
const moment = require('moment-timezone')
const router = express.Router()
const Order = require('../models/Order')

async function countOrders(time) {
    // let pickupTime = moment.tz('Pacific/Auckland').startOf('day').add(time)
    // const now = moment.tz('Pacific/Auckland')

    // if(now.hour() > 20 || (now.hour() === 20 && now.minute() > 15)) {
    //     pickupTime.add(1, 'd')
    // }

    const orders = await Order.find({pickupTime: time.format('YYYY-MM-DD H:mm')})
    
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
    const orderTime = moment(date).startOf('d').add(currentTime)
    const splitTime = currentTime.split(':')
    if(date === undefined && (Number(splitTime[0]) >= 20 || Number(splitTime[0]) === 19 && Number(splitTime[1]) >= 50 )) orderTime.add(1, 'd')
    //console.log(date, orderTime.format('YYYY-MM-DD HH:mm'))

    if(orderTime.hour() >= closeHour) {
        orderTime.hour(10).minute(55)
    } else {
        if((orderTime.hour() === 10 && orderTime.minute() < 50) || orderTime.hour() < 11 || (orderTime.hour() === 19 && orderTime.minute() >= 50)) {
            orderTime.hour(10).minute(50)
        } else {
            const remainder = orderTime.minute() % 10;
            orderTime.add((10 - remainder) + 5, 'm')
        }
    }

    while(orderTime.add(increment, 'm').hour() < closeHour) {
        let count = await countOrders(orderTime)
        time.push({time: orderTime.format('HH:mm'), available: (count < 4)})
    }

    return time
}

router.get('/orders', async (req, res) => {
    let orders = await countOrders(req.body.time)

    res.json({orders: orders})
})

router.get('/', async (req, res) => {
    let time = await createArray(req.query.date)

    res.json(time)
})

module.exports = router