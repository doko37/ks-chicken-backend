const express = require('express')
const moment = require('moment-timezone')
const router = express.Router()
const Order = require('../models/Order')

async function countOrders(time) {
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
            time.push({time: tempTime.format('HH:mm'), available: (numHalfs + overload < 4)})
            overload -= 4
        } else {
            overload += await countOrders(tempTime)
            time.push({time: tempTime.format('HH:mm'), available: (overload < 4)})
            overload -= 4
        }
    }

    return time
}

// async function createArray(date) {
//     let time = []
//     const increment = 10
//     const closeHour = 20

//     const currentTime = moment.tz('Pacific/Auckland').format('HH:mm')
//     const orderTime = moment(date).startOf('d').add(currentTime)
//     const splitTime = currentTime.split(':')
//     if(date === undefined && (Number(splitTime[0]) >= 20 || Number(splitTime[0]) === 19 && Number(splitTime[1]) >= 50 )) orderTime.add(1, 'd')
//     //console.log(date, orderTime.format('YYYY-MM-DD HH:mm'))

//     if(orderTime.hour() >= closeHour) {
//         orderTime.hour(10).minute(50)
//     } else {
//         if((orderTime.hour() === 10 && orderTime.minute() < 50) || orderTime.hour() < 11 || (orderTime.hour() === 19 && orderTime.minute() >= 50)) {
//             orderTime.hour(10).minute(50)
//         } else {
//             const remainder = orderTime.minute() % 10;
//             orderTime.add((10 - remainder) + 10, 'm')
//         }
//     }

//     while(orderTime.add(increment, 'm').hour() < closeHour) {
//         let count = await countOrders(orderTime)
//         time.push({time: orderTime.format('HH:mm'), available: (count < 4)})
//     }

//     return time
// }

router.get('/orders', async (req, res) => {
    let orders = await countOrders(req.body.time)

    res.json({orders: orders})
})

router.get('/', async (req, res) => {
    let time = await createArray(req.query.date)

    res.json(time.reverse())
})

module.exports = router