const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const router = require("express").Router()

// CREATE GUEST USER
router.post("/createGuest", async (req, res) => {
    const newUser = new User(req.body)

    try {
        const savedUser = await newUser.save()

        const accessToken = jwt.sign(
            {
                id: savedUser._id,
                isAdmin: false
            },
            process.env.JWT_SEC,
            { expiresIn: "1h" }
        )

        const { id, ...others } = savedUser._doc

        res.status(200).json({ ...others, accessToken })
    } catch (err) { res.status(500).json(err) }
})

// CREATE NEW USER
router.post("/createUser", async (req, res) => {
    const newUser = new User({
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ),
        isGuest: false,
        isAdmin: false
    })

    try {
        const savedUser = await newUser.save()
        res.status(200).json(savedUser)
    } catch (err) { res.status(500).json(err) }
})

// LOGIN WITH EXISTING USER
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) return res.status(401).json("Invalid email")

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        )

        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)

        if (originalPassword != req.body.password) return res.status(401).json("Incorrect password")

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SEC,
            { expiresIn: "12h" }
        )

        const { password, ...others } = user._doc
        res.status(200).json({ ...others, accessToken })
    } catch (err) { res.status(500).json(err) }
})

module.exports = router