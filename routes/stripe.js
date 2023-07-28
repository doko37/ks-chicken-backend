const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')
const ChickenItem = require('../models/ChickenItem')
const SidesItem = require('../models/SidesItem')

const router = require("express").Router()
const stripe = require('stripe')(process.env.STRIPE_SEC_KEY)
const moment = require("moment")

function hasNumber(key) {
    return /\d/.test(key);
}

function keyWithoutNum(key) {
    let newKey = key.split('_')[0]
    return newKey
}

const calculateItemPrice = async (item) => {
    let originItem

    if(item.type === "chicken") {
        originItem = await ChickenItem.findOne({key: keyWithoutNum(item.key)})
    } else if(item.key.includes("chips")) {
        originItem = await SidesItem.findOne({key: "chips"})
    } else {
        return item.price
    }

    let price = 0
    if (item.type === "chicken") {
        price = item.size === 'half' ? originItem.half_price : originItem.full_price
    } else if (item.type === "sides") {
        if (item.key.includes("chips")) {
          price = item.size === 'medium' ? originItem.medium_price : originItem.large_price
        } else {
          price = originItem.price
        }
    }

    if (item.type === "chicken" || item.key.includes("chips")) {
        if (item.toppings.snowy) price += (2 * (item.type === 'chicken' ? (item.size === 'half' ? 1 : 2) : 1))
        if (item.toppings.onion) price += (2 * (item.type === 'chicken' ? (item.size === 'half' ? 1 : 2) : 1))
    }

    return price * item.quantity
}

const calculateTotal = async (items) => {
    let total = 0
    let marinated = 0
    let nonMarinated = 0
    let discount = 0

    for (let i in items) {
        total += await calculateItemPrice(items[i])*100
        if (items[i].chickenType === "marinated") marinated += 1
        else if (items[i].chickenType === "non_marinated") nonMarinated += 1
    }

    let mariLeftOver = marinated % 2;
    let nonMariLeftOver = nonMarinated % 2;

    if (marinated >= 2) {
        discount += ((marinated - mariLeftOver) / 2) * 3
    }

    if (nonMarinated >= 2) {
        discount += ((nonMarinated - nonMariLeftOver) / 2) * 1
    }

    if (mariLeftOver === 1 && nonMariLeftOver === 1) {
        discount += 2
    }

    return Math.round(((total - (discount * 100))/(1 - 0.029)) + 31)
}

router.post("/create-payment-intent/:id", verifyTokenAndAuthorization, async (req, res) => {
    const items = req.body.cart
    const amount = await calculateTotal(items)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "nzd",
        automatic_payment_methods: {
            enabled: true
        },
        metadata: {
            fname: req.body.fn,
            lname: req.body.ln,
            email: req.body.email,
            phoneNo: req.body.phno,
            userId: req.body.userId, 
            pickupTime: req.body.pickupTime
        }
    })

    res.json({
        clientSecret: paymentIntent.client_secret,
        amount: amount,
        userId: req.body.userId,
        pickupTime: req.body.pickupTime,
        email: req.body.email,
        orderNo: moment(req.body.pickupTime).format('MMDD') + req.body.userId.substring(req.body.userId.length - 4)
    })
})

module.exports = router