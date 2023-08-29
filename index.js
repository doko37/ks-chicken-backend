const express = require('express')
const app = express()
const mongoose = require('mongoose')
const OrderModel = require('./models/Order')
const dotenv = require("dotenv")
dotenv.config()
const dates = require('./routes/dates')
const times = require('./routes/times')
const itemRoute = require('./routes/items')
const authRoute = require('./routes/auth')
const cartRoute = require('./routes/cart')
const userRoute = require('./routes/user')
const stripeRoute = require('./routes/stripe')
const stripeWebhookRoute = require('./routes/stripeWebhook')
const orderRoute = require('./routes/order')
const cors = require('cors')
const fs = require('fs')

app.use(cors())
app.use(express.static("public"))
app.use("/api/stripeWebhook", stripeWebhookRoute)
app.use(express.json())
app.use('/api/dates', dates)
app.use('/api/times', times)

mongoose.connect(process.env.MONGO_URL).then(console.log("DB connected"))

app.use("/api/stripe", stripeRoute)
app.use("/api/items", itemRoute)
app.use("/api/auth", authRoute)
app.use("/api/cart", cartRoute)
app.use("/api/user", userRoute)
app.use("/api/order", orderRoute)

app.get('/.well-known/pki-validation/AEF171AF202DFE2DB2A503F09E80CC02.txt', (req, res) => {
    res.sendFile('C:/Users/hunub/OneDrive/Documents/ks-chicken/server/AEF171AF202DFE2DB2A503F09E80CC02.txt')
})

app.listen(3001, () => {
    console.log("listening on port 3001")
})