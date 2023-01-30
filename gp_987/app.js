$( document ).ready(function() {
  $('#enter-btn').on('click', function() {
    $('#form-start').hide();
     return false;
   });
  $('#submit-btn').on('click', function() {
    $('#loading').show();
    submitSinglePayment();
    return false;
  });


  ///$('#qrcode').qrcode("this plugin is great");

})




function submitSinglePayment() {
  let customRefId = "Test" + new Date().getTime(),
      amount = $('#amount').val(),
      apiToken = "Basic " + $('#key').val(),
      json = {
    "requestPayload": {
        "refId": customRefId,
        "to": {
            "id": "m:uRTubPP6giZw3GMvMkdZtiiKqkw:5zKtXEAq",
            "realmId": "m:4HUsyeQwKzhw6YvFgoPxfUWxQiWX:5zKtXEAq",
        },
        "actingAs":{                             
           "refId": "862bc05d-e5e9-43f6-bb9b-89c14526b636",
                  },
        "transferBody": {
            "currency": "GBP",
            "lifetimeAmount": amount,
            "instructions": {
                "transferDestinations": [
                    {
                        "fasterPayments": {
                            "sortCode": "400530",
                            "accountNumber": "64592638"
                        },
                        "customerData": {
                            "legalNames": [
                                "TSYSSocialWellbeing"  
                            ]

                        } 
                    }
                ]
            }
        },
        "description": "Demo App",
        "redirectUrl": "https://www.globalpayments.com"
    }
  }


  fetch("https://api.token.io/token-requests", {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization" : apiToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(json),
  }).then(function(response) {
    $('#loading').hide();
    if (response.ok) {
      return response.json();
    } else {
      return response.text().then(text => { throw new Error(`There has been a problem with the API response: "${text}"`) });
    }
    
  }).then(function(parsedData) {
    console.log("The request ID is ", parsedData.tokenRequest.id);
    console.log("You are paying", amount)
    $('#qrcode').qrcode("https://web-app.token.io/app/request-token/" + parsedData.tokenRequest.id);
    $('#qr-instruction').show();
    $('#form-input').hide();
    const jsConfetti = new JSConfetti()
    jsConfetti.addConfetti({
      emojis: ['💵', '💸', ],
      confettiNumber: 50,
    })

    ///window.location = "https://web-app.token.io/app/request-token/" + parsedData.tokenRequest.id
  }).catch(function(error) {
    $('#error').show();
  });
}


