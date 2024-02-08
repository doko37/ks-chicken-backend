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
    const mongo_url = await getSecret()

    app.use(cors())
    app.use(express.static("public"))
    app.use("/api/stripeWebhook", stripeWebhookRoute)
    app.use(express.json())
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'https://kschicken.co.nz');
        //res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
    app.use('/api/dates', dates)
    app.use('/api/times', times)

    mongoose.connect(mongo_url).then(console.log("DB connected"))

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
