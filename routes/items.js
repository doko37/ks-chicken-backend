const ChickenItem = require('../models/ChickenItem')
const SidesItem = require('../models/SidesItem')

const router = require("express").Router()

// POST CHICKEN ITEM
router.post("/chicken", async (req, res) => {
    const newItem = new ChickenItem(req.body)
    try {
        const savedItem = await newItem.save()
        res.status(200).json(savedItem)
    } catch (err) {
        res.status(500).json(err)
    }
})

// POST SIDE ITEM
router.post("/sides", async (req, res) => {
    const newItem = new SidesItem(req.body)
    try {
        const savedItem = await newItem.save()
        res.status(200).json(savedItem)
    } catch (err) {
        res.status(500).json(err)
    }
})

// GET ALL CHICKEN ITEMS
router.get("/chicken", async (req, res) => {
    try {
        const products = await ChickenItem.find()
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json(err)
    }
})

// GET ALL SIDE ITEMS
router.get("/sides", async (req, res) => {
    try {
        const products = await SidesItem.find()
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router