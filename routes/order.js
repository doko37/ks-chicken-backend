const mongoose = require('mongoose')
const Order = require('../models/Order')
const router = require("express").Router()
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('./verifyToken')

router.post("/timeAvailable", async (req, res) => {
    // TODO: return the number of order times that needs to be offset for the numHalfs the customer is ordering.

    let { numHalfs, pickupTime } = req.body;
    const orders = await Order.find({pickupTime: pickupTime})
    for(i in orders) {
        numHalfs += orders[i].user.cart.numHalfs
    }

    res.status(200).json({ leftover: numHalfs - 4 })
})

router.get("/orderExists/:orderNo", async (req, res) => {
    const order = await Order.findOne({orderNo: req.params.orderNo})
    res.status(200).json({orderExists: order ? true : false})
})

router.get("/:orderNo", verifyTokenAndAdmin, async (req, res) => {
    try {
        const order = await Order.findOne({orderNo: req.params.orderNo})
        res.status(200).json(order)
    } catch(err) { res.status(500).json(err) }
})

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find().sort({"pickupTime" : 1})
        res.status(200).json(orders)
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