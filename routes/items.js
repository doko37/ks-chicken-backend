const ChickenItem = require('../models/ChickenItem')
const SidesItem = require('../models/SidesItem')

const router = require("express").Router()

function hasNumber(key) {
    return /\d/.test(key);
}

function keyWithoutNum(key) {
    let newKey = key.split('_')[0]
    return newKey
}

router.post("/updatePrice", async (req, res) => {
    console.log(req.body.item)
    const item = req.body.item

    let originItem

    if(hasNumber(item.key)) {
        if(item.type === "chicken") {
            originItem = await ChickenItem.findOne({key: keyWithoutNum(item.key)})
        } else if(item.key.includes("chips")) {
            originItem = await SidesItem.findOne({key: "chips"})
        } else {
            res.send({price: item.price})
            return
        }
    } else {
        res.send({price: item.price})
        return
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
      
    res.send({price: (price * item.quantity)})
})

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