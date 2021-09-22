var stripe = Stripe("pk_test_51JZmYCFTKFTNoa67Bkl3CHDWFxHi7OqMMwWJIj3e5K0On7B7Ar7MBkKIL06w6phX7REtPmT9d95Wbn80nFV2NHM100U02aZCLM");

// dummy variable for now
var purchase = {
    items: [{ id: "xl-shirt"}]
};

fetch("/create-payment-intent", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(purchase)
})
    .then(function(result) {
        return result.json();
    })
    .then(function(data) {
        var elements = stripe.elements();

        var style = {
            base: {
              color: "#32325d",
              fontFamily: 'Arial, sans-serif',
              fontSmoothing: "antialiased",
              fontSize: "16px",
              "::placeholder": {
                color: "#32325d"
              }
            },
            invalid: {
              fontFamily: 'Arial, sans-serif',
              color: "#fa755a",
              iconColor: "#fa755a"
            }
          };

        var card = elements.create("card", {style: style});
        card.mount("#card-element");

        card.on("change", function(event) {
            document.querySelector("button").disabled = event.empty;
            document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
        });

        var form = document.getElementById("payment-form");
        form.addEventListener("submit", function(event) {
            event.preventDefault();

            // processing payment upon "submit"
            payWithCard(stripe, card, data.clientSecret);
        })
    });

var payWithCard = function(stripe, card, clientSecret) {
    loading(true);
    stripe
        .confirmCardPayment(clientSecret, {
            payment_method: {
                card: card
            }
        })
        .then(function(result) {
            if (result.error) {
                showError(result.error.message);
            } else {
                orderComplete(result.paymentIntent.id);
            }
        });
};

// optional styling the form object

// optional catching card errors as form is updated

// optinoal displaying error in processing payment

// optional success message and animations
var orderComplete = function(paymentIntentId) {

    // animations are done
    loading(false);

    // creating the link to the stripe dashboard
    document
        .querySelector(".result-message a")
        .setAttribute(
            "href",
            "https://dashboard.stripe.com/test/payments/" + paymentIntentId
        );
    
        document.querySelector(".result-message").classList.remove("hidden");
        document.querySelector("button").disabled = true;
}

// Show the customer the error from Stripe if their card fails to charge
var showError = function(errorMsgText) {
    loading(false);
    var errorMsg = document.querySelector("#card-error");
    errorMsg.textContent = errorMsgText;
    setTimeout(function() {
      errorMsg.textContent = "";
    }, 4000);
  };

// spinning animation on submit button
var loading = function(isLoading) {
    if (isLoading) {

        // show the spinner not the button
        document.querySelector("button").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden"); 
    } else {

        // hide the spinner if not loading, show the button
        document.querySelector("button").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
}

