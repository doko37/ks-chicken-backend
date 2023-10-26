const mongoose = require('mongoose')
const Order = require('../models/Order')
const CompletedOrder = require('../models/CompletedOrder')
const router = require("express").Router()
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('./verifyToken')
const moment = require('moment-timezone')

router.post("/numHalfs", async (req, res) => {
    let { pickupTime } = req.body;
    const orders = await Order.find({pickupTime: pickupTime})
    let numHalfs = 0
    for(i in orders) {
        numHalfs += orders[i].user.cart.numHalfs
    }

    res.status(200).json({ numHalfs: numHalfs })
})

router.post("/complete/:orderNo", verifyTokenAndAdmin, async (req, res) => {
    try {
        Order.findOne({orderNo: req.params.orderNo}).then(async (response) => {
            let orderJSON = response.toJSON()
            const {confirmed, ...order} = orderJSON
            order.completedAt = moment().format("YYYY-MM-DD HH:mm")
            const completedOrder = CompletedOrder(order)
            await completedOrder.save()
            await Order.deleteOne({orderNo: req.params.orderNo})
        })
        res.status(200).json({message: `Order ${req.params.orderNo} completed.`})
    } catch(err) { res.status(500).json(err) }
})

router.put("/confirm/:orderNo", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.updateOne({orderNo: req.params.orderNo}, {confirmed: true})
        res.status(200).json({message: `Order ${req.params.orderNo} confirmed.`})
    } catch(err) { res.status(500).json(err) }
})

router.get("/orderExists/:orderNo", async (req, res) => {
    const order = await Order.findOne({orderNo: req.params.orderNo})
    res.status(200).json({orderExists: order ? true : false})
})

router.get("/today", verifyTokenAndAdmin, async (req, res) => {
    try {
        const now = moment.tz('Pacific/Auckland')
        const today = now.add(now.hour() >= 20 ? 1 : 0, 'd').format('YYYY-MM-DD')
        console.log(today)
        const orders = await Order.find({"pickupDate" : today}).sort({"pickupTime": 1})
        res.status(200).json(orders)
    } catch(err) { res.status(500).json(err) }
})

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await CompletedOrder.find().sort({"pickupTime" : 1})
        res.status(200).json(orders)
    } catch(err) { res.status(500).json(err) }
})

router.get("/:orderNo", verifyTokenAndAdmin, async (req, res) => {
    try {
        const order = await Order.findOne({orderNo: req.params.orderNo})
        res.status(200).json(order)
    } catch(err) { res.status(500).json(err) }
})

router.delete("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.deleteMany()
        res.status(200).json("All orders have been deleted")
    } catch(err) { res.status(200).json(err) }
})

router.delete("/:orderNo", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.deleteOne({orderNo: req.params.orderNo})
        res.status(200).json(`Order # ${req.params.orderNo} has been deleted.`)
    } catch(err) { res.status(200).json(err) }
})

module.exports = router