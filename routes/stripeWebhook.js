const router = require("express").Router()
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SEC_KEY)
const mongoose = require('mongoose')
const User = require('../models/User')
const OrderModel = require('../models/Order')
const nodemailer = require('nodemailer')
const mailgen = require('mailgen')
const moment = require('moment')

const endpointSecret = "whsec_8d64f1f6dae0e7239325380e5f739e2a89fdeb779182e4b1ada1d451c249a866";

router.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.log(err.message)
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.created':
      console.log("Payment Intent Created")
      break;
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    case 'charge.succeeded':
      const data = JSON.parse(request.body).data.object.metadata
      const user = await User.findById(data.userId)
      const custInfo = {
        fname: data.fname,
        lname: data.lname,
        email: data.email,
        phoneNo: data.phoneNo,
        cart: user.cart
      }

      const orderNumber = moment(data.pickupDate).format('MMDD') + data.userId.substring(data.userId.length - 4)
      const order = {
        user: custInfo,
        pickupDate: data.pickupDate,
        pickupTime: data.pickupTime,
        orderNo: orderNumber,
        confirmed: false
      }

      const newOrder = new OrderModel(order)
      await newOrder.save()

      const config = {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS
        }
      }

      const transporter = nodemailer.createTransport(config)

      const mail = `
        <main>
            <img src="https://i.ibb.co/0tsCTMh/logo.png" alt="logo" border="0" style="height: 80px; margin-bottom: 1rem; background-color: #252425; padding: 1rem; border-radius: 0.5rem">
            <h3>Hi ${data.fname}, Thank you for your order!</h3>
            <h4>Your order:</h4>
            ${user.cart.items.map(item => `<p>${item.name} x${item.quantity}</p>`)}
            <h4>Order total: $${(data.total / 100).toFixed(2)}</h4>
            <h4>It will be ready for pick up at:</h4>
            <p>${moment(data.pickupDate).startOf('d').add(data.pickupTime).format('dddd, MMM Do, h:mm A')}</p>
        </main>
        `

      const message = {
        from: process.env.EMAIL,
        to: data.email,
        subject: `KS Chicken - Order #${orderNumber}`,
        html: mail
      }

      transporter.sendMail(message).catch(error => {
        return response.status(500).json({ error })
      })

      if (user.isGuest) {
        await User.findByIdAndDelete(data.userId)
      }

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send({ msg: "Order has been placed." });
});

module.exports = router