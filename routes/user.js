const User = require('../models/User')
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')

const router = require("express").Router()

// UPDATE USER CART
router.put("/updateCart/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: { cart: req.body.cart }
            },
            { new: true }
        )

        res.status(200).json(updatedUser)
    } catch (err) { res.status(500).json(err) }
})

// DELETE USER
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted")
    } catch (err) { res.status(500).json(err) }
})

// DELETE ALL GUESTS
router.delete("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        await User.deleteMany({ isGuest: true })
        res.status(200).json("All guests have been deleted")
    } catch (err) { res.status(500).json(err) }
})

// GET USER
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (err) { res.status(500).json(err) }
})

// GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (err) { res.status(500).json(err) }
})

module.exports = router