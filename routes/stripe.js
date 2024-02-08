const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')
const ChickenItem = require('../models/ChickenItem')
const SidesItem = require('../models/SidesItem')
const DrinksItem = require('../models/DrinksItem')

const router = require("express").Router()
const moment = require("moment")
const {
    SecretsManagerClient,
    GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

let stripe

const getSecret = async () => {
    const client = new SecretsManagerClient({
        region: "ap-southeast-2",
    });

    const secret_stripe_sec_key = process.env.STRIPE_SEC_KEY

    try {
        response = await client.send(
            new GetSecretValueCommand({
                SecretId: secret_stripe_sec_key,
                VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
            })
        );
    } catch (error) {
        throw error;
    }

    stripe = require('stripe')(response.SecretString);
}

function hasNumber(key) {
    return /\d/.test(key);
}

function keyWithoutNum(key) {
    let newKey = key.split('_')[0]
    return newKey
}

const calculateItemPrice = async (item) => {
    let originItem = null
    let itemQuantity = item.quantity <= 0 ? 1 : item.quantity

    if (item.type === "chicken") {
        originItem = await ChickenItem.findOne({ key: keyWithoutNum(item.key) })
    } else if (item.key.includes("chips")) {
        originItem = await SidesItem.findOne({ key: "chips" })
    } else if (item.type === "drinks") {
        originItem = await DrinksItem.findOne({ key: keyWithoutNum(item.key) })
        let size = originItem.size.find(i => i.size === item.size)
        return (originItem.price + size.price) * itemQuantity
    } else if (item.type === "sides") {
        return 3 * itemQuantity
    }

    if (originItem === null) return null

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

    return price * itemQuantity
}

const calculateTotal = async (items) => {
    let total = 0
    let marinated = 0
    let nonMarinated = 0
    let discount = 0

    for (let i in items) {
        let price = await calculateItemPrice(items[i])
        if (price === null) return null
        total += price * 100
        if (items[i].type === "chicken" && items[i].size === "half") {
            if (items[i].chickenType === "marinated") marinated += 1
            else if (items[i].chickenType === "non_marinated") nonMarinated += 1
        }
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

    return Math.round(((total - (discount * 100)) / (1 - 0.029)) + 31)
}

router.post("/create-payment-intent/:id", verifyTokenAndAuthorization, async (req, res) => {
    await getSecret()
    const items = req.body.cart
    let amount
    try {
        amount = await calculateTotal(items)
        if (amount === null) {
            res.status(500).json("Invalid Items")
            return
        }
    } catch (err) { res.status(500).json(err) }

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
            pickupDate: req.body.pickupDate,
            pickupTime: req.body.pickupTime,
            total: amount
        }
    })

    res.json({
        clientSecret: paymentIntent.client_secret,
        amount: amount,
        userId: req.body.userId,
        pickupDate: req.body.pickupDate,
        pickupTime: req.body.pickupTime,
        email: req.body.email,
        orderNo: moment(req.body.pickupDate).format('MMDD') + req.body.userId.substring(req.body.userId.length - 4)
    })
})

module.exports = router