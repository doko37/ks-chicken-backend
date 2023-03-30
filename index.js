const express = require('express')
const app = express()
const mongoose = require('mongoose')
const OrderModel = require('./models/Order')
const moment = require('moment')
const dotenv = require("dotenv")
const dates = require('./routes/dates')
const times = require('./routes/times')
const itemRoute = require('./routes/items')
const authRoute = require('./routes/auth')
const cartRoute = require('./routes/cart')
const userRoute = require('./routes/user')

dotenv.config()

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use('/api/dates', dates)
app.use('/api/times', times)

mongoose.connect(process.env.MONGO_URL).then(console.log("DB connected"))

app.use("/api/items", itemRoute)
app.use("/api/auth", authRoute)
app.use("/api/cart", cartRoute)
app.use("/api/user", userRoute)

app.post("/submitOrder", async (req, res) => {
    const order = req.body
    const newOrder = new OrderModel(order)
    await newOrder.save()

    res.json(order)
})

app.listen(3001, () => {
    console.log("listening on port 3001")
})

