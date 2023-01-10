$( document ).ready(function() {
  $('#submit-btn').on('click', function() {
    $('#loading').show();
    createUrl();
    $('#form-input').hide();
    return false;
  });

  $('.disabled-popover').popover();
})

function createUrl() {
  let customRefId = "Test" + new Date().getTime(),
      amount = $('#amount').val(),
      json = {
    "requestPayload": {
        "refId": customRefId,
        "to": {
            "alias": {
                "type": "DOMAIN",
                "value": "hsbcshadow.com",
                "realm": "",
                "realmId": "m:jH8SCQjtW9uGEQCrNS99qCJ8cHN:5zKtXEAq"
            },
            "id": "ID"
        },
        "transferBody": {
            "currency": "GBP",
            "lifetimeAmount": amount,
            "instructions": {
                "transferDestinations": [
                    {
                        "fasterPayments": {
                            "sortCode": "208915",
                            "accountNumber": "50279986"
                        },
                        "customerData": {
                            "legalNames": [
                                "Capital One Demo App"
                            ]
                        }
                    }
                ]
            }
        },
        "description": "CapitalOneDemoPayment",
        "redirectUrl": "https://capitalone.co.uk/"
    }
  }

  fetch("https://api.token.io/token-requests", {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization" : "Basic API_TOKEN",
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
    window.location = "https://web-app.token.io/app/request-token/" + parsedData.tokenRequest.id
  }).catch(function(error) {
    $('#error').show();
  });
}

