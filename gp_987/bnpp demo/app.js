$( document ).ready(function() {
  $('#enter-btn').on('click', function() {
    $('#form-start').hide();
     return false;
   });
  $('#submit-btn').on('click', function() {
    $('#loading').show();
    if($('#paybybank').is(':checked')) {
      submitSinglePayment();
    } else if ($('#paybyvrp').is(':checked')) {
      submitVrp()
    }
    $('#form-input').hide();
    $('#vrpFields').hide();
    return false;
  });

  $('.disabled-popover').popover();
  $('.datepicker').datepicker({
    format: 'dd/mm/yy'
  });

  $('#paybyvrp').on('change', function() {
    if($('#paybyvrp').is(':checked')) {
      $('#vrpFields').show();
    }
  });

  $('#paybybank').on('change', function() {
    if($('#paybybank').is(':checked')) {
      $('#vrpFields').hide();
    }
  });
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
        },
        "countries":["GB"],
        "actingAs":{                             
          "refId": "634e1d35-15a4-4e07-8105-047f18a63257"
                 },
        "transferBody": {
            "currency": "GBP",
            "lifetimeAmount": amount,
            "instructions": {
                "transferDestinations": [
                    {
                        "fasterPayments": {
                            "sortCode": "040004",
                            "accountNumber": "79757973"
                        },
                        "customerData": {
                            "legalNames": [
                                "Demo App"  
                            ]

                        } 
                    }
                ]
            }
        },
        "description": "Global Payment Demo",
        "redirectUrl": "https://elisacazzola.github.io/gp_987/repaymentdemo/thanks"
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
    window.location = "https://web-app.token.io/app/request-token/" + parsedData.tokenRequest.id
  }).catch(function(error) {
    $('#error').show();
  });
}

function submitVrp() {
  let customRefId = "Test" + new Date().getTime(),
      apiToken = "Basic " + $('#key').val(),
      json = {
          "initiation": {
            "currency": "GBP",
            "refId": customRefId,
            "remittanceInformationPrimary": "AjBell Demo",
            "startDateTime": "2023-06-01T00:00:00.000+00:00",
            "endDateTime": "2029-09-01T00:00:00.000+00:00",
            "vrpType": "SWEEPING", 
            "localInstrument": "FASTER_PAYMENTS",
            "creditor": {
              "name": "Elisa Cazzola",
              "sortCode": "040004",
              "accountNumber": "79757973"
            },
            "maximumIndividualAmount": "1.00",
            "periodicLimits": [
                {
                    "maximumAmount": "10.00",
                    "periodType": "MONTH"
                }
            ],
            "bankId": "ob-barclays",
            "merchantCategoryCode": "1520",
            "standardSpecific": {
            "obie": {
                "paymentContextCode": "ECOMMERCE_GOODS",
                "merchantCustomerIdentification": "string"
              }
            },
            "callbackUrl": "https://elisacazzola.github.io/gp_987/repaymentdemo/vrpthanks",
            "returnRefundAccount": true
        }
    
    }


  fetch("https://api.token.io/vrp-consents", {
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
    console.log("The request ID is ", parsedData.vrpConsent.id);
    console.log("You are paying", amount)
    window.location = "https://web-app.token.io/app/initiation?vrp-consent-id=" + parsedData.vrpConsent.id
  }).catch(function(error) {
    $('#error').show();
  });
}
