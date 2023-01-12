$( document ).ready(function() {
  $('#enter-btn').on('click', function() {
    $('#form-start').hide();
     return false;
   });
  $('#submit-btn').on('click', function() {
    $('#loading').show();
    createUrl();
    $('#form-input').hide();
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


function createUrl() {
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
