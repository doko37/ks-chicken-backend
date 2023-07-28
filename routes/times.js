const express = require('express')
const moment = require('moment')
const router = express.Router()
const Order = require('../models/Order')

async function countOrders(time) {
    let pickupTime = moment().startOf('day').add(time)
    const now = moment()

    if(now.hour() > 20 || (now.hour() === 20 && now.minute() > 15)) {
        pickupTime.add(1, 'd')
    }

    const orders = await Order.find({pickupTime: pickupTime.format('YYYY-MM-DD H:mm')})
    
    let count = 0

    for(let i in orders) {
        let cart = orders[i].user.cart

        count += cart.numHalfs
    }

    return count
}

async function createArray() {
    let time = []
    const increment = 5
    const closeHour = 20
    
    const currentTime = moment();

    if(currentTime.hour() > closeHour) {
        currentTime.hour(10).minute(55)
    } else {
        if(currentTime.hour() === closeHour && currentTime.minute() > 15) {
            currentTime.hour(10).minute(55)
        } else {
            const remainder = currentTime.minute() % 5;
            currentTime.add((5 - remainder) + 5, 'm')
        }
    }

    while(currentTime.add(increment, 'm').hour() <= closeHour) {
        let count = await countOrders(currentTime.format('HH:mm'))
        if(count < 4) {
            if(currentTime.hour() === closeHour) {
                if(currentTime.minute() <= 30) {
                    time.push({time: currentTime.format('HH:mm'), available: true})
                }
            } else {
                time.push({time: currentTime.format('HH:mm'), available: true})
            }
        } else {
            time.push({time: currentTime.format('HH:mm'), available: false})
        }
    }

    return time
}

router.get('/orders', async (req, res) => {
    let orders = await countOrders(req.body.time)

    res.json({orders: orders})
})

router.get('/', async (req, res) => {
    let time = await createArray()

    res.json(time)
})

module.exports = router