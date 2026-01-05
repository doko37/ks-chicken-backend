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
const userRoute = require('./routes/user')
const stripeRoute = require('./routes/stripe')
const stripeWebhookRoute = require('./routes/stripeWebhook')
const orderRoute = require('./routes/order')
const cors = require('cors')
const allowedOrigins = [
    'https://kschicken.co.nz',
    'http://localhost:3000'
];
const {
    SecretsManagerClient,
    GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager")

const getSecret = async () => {
    const secret_monogo_url_name = process.env.MONGO_URL

    const client = new SecretsManagerClient({
        region: "ap-southeast-2",
    });

    let response;

    try {
        response = await client.send(
            new GetSecretValueCommand({
                SecretId: secret_monogo_url_name,
                VersionStage: "AWSCURRENT",
            })
        );
    } catch (error) {
        console.log(error)
    }
    return response.SecretString
}

const start = async () => {
    const key = await getSecret()
    const mongo_url = JSON.parse(key)

    app.use(cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true)
            }
            return callback(new Error('Not allowed by CORS'))
        },
        methods: ['GET', 'POST', 'PUT'],
        allowedHeaders: ['Content-Type', 'Authorization', 'token']
    }))
    app.use(express.static("public"))
    app.use("/api/stripeWebhook", stripeWebhookRoute)
    app.use(express.json())
    app.use('/api/dates', dates)
    app.use('/api/times', times)

    mongoose.connect(mongo_url.MONGO_URL)
		.then(console.log("DB connected"))
		.catch((e) => console.log("DB Error: " + e))

    app.use("/api/stripe", stripeRoute)
    app.use("/api/items", itemRoute)
    app.use("/api/auth", authRoute)
    app.use("/api/user", userRoute)
    app.use("/api/order", orderRoute)

    const port = process.env.PORT || 3001
    app.listen(port, () => {
        console.log(`🚀 listening on port ${port}`)
    })
}

start()
