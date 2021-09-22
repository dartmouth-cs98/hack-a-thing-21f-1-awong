/*
*   Alex Wong
*   CS 98, Hackathon 1
*   Followed Stripe Tutorial: https://stripe.com/docs/payments/integration-builder
*/

const express = require("express");
const app = express();


const stripe = require("stripe")("sk_test_51JZmYCFTKFTNoa67EWCWz2X5GY5M29u5GWyZPtpdxoQup9QotxFaytuMEZDopargmSCkmfqjrftdUruHJYq3siI300uZQXUiJ0");

app.use(express.static("public"));
app.use(express.json());

// place holder calculator
const calculateOrderAmount = items => {
    return 1400;
};

// charging the customer adding more payment methods
const chargeCustomer = async (customerId) => {

    // pulling all the payment methods available
    const payMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card"
    });

    // charging the customer and payment
    const payIntent = await stripe.paymentIntents.create({
        amount: 1099,
        currency: "usd",
        custommer: customerId,
        payment_method: paymentMethods.data[0].id,
        off_session: true,
        confirm: true
    });

    if (payIntent.status === "succeeded") {
        console.log("Successfully charged card");
    }
}

app.post("/create-payment-intent", async (req, res) => {
    const {items} = req.body;

    // creates a customer object
    const customer = await stripe.customers.create();

    const paymentIntent = await stripe.paymentIntents.create({
        customer: customer.id,
        setup_future_usage: 'off_session',
        amount: calculateOrderAmount(items),
        currency: "usd"
    });

    res.send({
        clientSecret: paymentIntent.client_secret
    });
});

app.listen(4242, () => console.log("listening on 4242"));