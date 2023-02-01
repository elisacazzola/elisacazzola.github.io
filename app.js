$( document ).ready(function() {
  $('#enter-btn').on('click', function() {
    
    jsConfetti = new JSConfetti()
    jsConfetti.addConfetti({
      emojis: [ '🍓', '🍋', '🌸', '🇮🇹'],
      confettiNumber: 200,
      confettiRadius: 1,
    })

  });

})

