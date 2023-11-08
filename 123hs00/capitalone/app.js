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
            "id": "m:2GKYMZ1C1SXuCkpmxcfMiHx4qn79:5zKtXEAq",
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
        "description": "Repayment of card 4242",
        "redirectUrl": "https://elisacazzola.github.io/123hs00/capitalone/thanks"
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
            "remittanceInformationPrimary": "Demo",
            "remittanceInformationSecondary": "secondary remittance info",
            "startDateTime": "2023-12-01T00:00:00.000+00:00",
            "endDateTime": "2024-0612-01T00:00:00.000+00:00",
            "vrpType": "SWEEPING", 
            "localInstrument": "FASTER_PAYMENTS",
            "creditor": {
              "name": "Elisa",
              "sortCode": "040004",
              "accountNumber": "79757973"
            },
            "maximumIndividualAmount": "1.00",
            "periodicLimits": [
                {
                    "maximumAmount": "1.00",
                    "periodType": "MONTH"
                }
            ],
            "callbackUrl": "https://elisacazzola.github.io/123hs00/capitalone/vrpthanks",
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
