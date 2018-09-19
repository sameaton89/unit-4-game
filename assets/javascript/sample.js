var characters, gameState


function startGame () {

  characters = resetCharacters()
  gameState = resetGameState()

  renderCharacters()
}

function resetCharacters () {

    return {
    "Wally": {
        name: "WALLY",
        health: 120,
        attack: 8,
        imageUrl: "assets/images/wally.png",
        enemyAttackBack: 15

    },
    "Andre": {
        name: "ANDRE",
        health: 100,
        attack: 14,
        imageUrl: "assets/images/andre.png",
        enemyAttackBack: 5
    },
    "Bartender": {
        name: "BARTENDER",
        health: 150,
        attack: 8,
        imageUrl: "assets/images/bartender.png",
        enemyAttackBack: 5
    },
    "Waiter": {
        name: "WAITER",
        health: 180,
        attack: 7,
        imageUrl: "assets/images/waiter2.png",
        enemyAttackBack: 25
     }
  }
}

function resetGameState () {
  return {
    selectedCharacter: null,
    selectedDefender: null,
    enemiesLeft: 0,
    numAttacks: 0
  }
}

function createCharDiv (character, key) {

  var charDiv = $("<div class='character' data-name='" + key + "'>")
  var charName = $("<div class='character-name'>").text(character.name)
  var charImage = $("<img alt='image' class='character-image'>").attr('src', character.imageUrl)
  var charHealth = $("<div class='character-health'>").text(character.health)
  charDiv.append(charName).append(charImage).append(charHealth)
  return charDiv
}

function renderCharacters () {
  console.log('rendering characters')
  var keys = Object.keys(characters)
  for (var i = 0; i < keys.length; i++) {
    var characterKey = keys[i]
    var character = characters[characterKey]
    var charDiv = createCharDiv(character, characterKey)
    $('#character-section').append(charDiv)
  }
}

function renderOpponents (selectedCharacterKey) {
  var characterKeys = Object.keys(characters)
  for (var i = 0; i < characterKeys.length; i++) {
    if (characterKeys[i] !== selectedCharacterKey) {
      var enemyKey = characterKeys[i]
      var enemy = characters[enemyKey]

      var enemyDiv = createCharDiv(enemy, enemyKey)
      $(enemyDiv).addClass('enemy')
      $('#enemies').append(enemyDiv)
    }
  }
}


function enableEnemySelection () {
  $('.enemy').on('click.enemySelect', function () {
    console.log('opponent selected')
    var opponentKey = $(this).attr('data-name')
    gameState.selectedDefender = characters[opponentKey]

    $('#defender').append(this)
    $('#attack').show()
    $('.enemy').off('click.enemySelect')
  })
}

function attack (numAttacks) {
  console.log('attacking defender')
  gameState.selectedDefender.health -= gameState.selectedCharacter.attack * numAttacks
}


function defend () {
  console.log('defender countering')
  gameState.selectedCharacter.health -= gameState.selectedDefender.enemyAttackBack
}


function isCharacterDead (character) {
  console.log('checking if player is dead')
  return character.health <= 0
}

function isGameWon () {
  console.log('checking if you won the game')
  return gameState.enemiesLeft === 0
}

function isAttackPhaseComplete () {
  if (isCharacterDead(gameState.selectedCharacter)) {
    alert('You were defeated by ' + gameState.selectedDefender.name + '. Click reset to play again.')
    $('#your-character').empty()
    $('#reset').show()

    return true // returning true because attack phase has completed.
  } else if (isCharacterDead(gameState.selectedDefender)) {
    console.log('defender dead')

    // decrement enemiesLeft counter and empty defender div
    gameState.enemiesLeft--
    $('#defender').empty()

    // checks if you win the game, or if there are more characters to fight
    if (isGameWon()) {
      // show reset button and alert
      alert('You win! Click Reset to play again')
      $('#reset').show()
    } else {
      // Prompt user to select another enemy
      alert('You defeated ' + gameState.selectedDefender.name + '! Select another enemy to fight.')
      enableEnemySelection()
    }
    return true // returning true because attack phase has completed.
  }
  // returning false, because attack phase is not complete.
  return false
}

// used when clicking on reset button to reset the game.
function emptyDivs () {
  // empty out all content areas
  $('#your-character').empty()
  $('#defender').empty()
  $('#enemies .enemy').empty()
  $('#character-section').empty()
  $('#characters').show()
}

// Attach handlers and start game once document has fully loaded.
// NOTE: function declarations (above) do not need to be wrapped in the document.ready function,
// but click handlers (below) do, since they rely on DOM elements being present to attach properly.
$(document).ready(function () {
  /* CLICK HANDLERS */

  /*
  * HOMEWORK INSTRUCTIONS: When the game starts, the player will choose a character
   by clicking on the fighter's picture.
   The player will fight as that character for the rest of the game.
  */

  // NOTE: the second argument to the "on" method below means this is a "delegated event" listener
  // that will still trigger for dynamically added elements with the class ".character" .
  // The selector in the $ needs to be present when the event is attached in order for event
  // delegation to work.
  // This code reads: attach the function to all current and future elements with a class of character
  // inside of the element with ID character-area, triggered on click.
  $('#characters-section').on('click', '.character', function () {
    // store selected character in javascript

    var selectedKey = $(this).attr('data-name')
    gameState.selectedCharacter = characters[selectedKey]
    console.log('player selected')

    // move to selected section
    $('#your-character').append(this)

    /*
      HOMEWORK INSTRUCTIONS: Enemies should be moved to a different area of the screen.
    */
    renderOpponents(selectedKey)

    // then hide the characters-section from view
    $('#characters').hide()

    // set the number of enemies, and enable enemy selection;
    gameState.enemiesLeft = Object.keys(characters).length - 1
    enableEnemySelection()
  })

  $('#attack').on('click.attack', function () {
    console.log('attack clicked')
    // increment attackCounter (for power scaling of player attacks)
    gameState.numAttacks++

    // attack and defend stages
    attack(gameState.numAttacks)
    defend()

    // display updated values for character health
    $('#your-character .character-health').text(gameState.selectedCharacter.health)
    $('#defender .character-health').text(gameState.selectedDefender.health)

    // hide the attack button if attack phase is over
    if (isAttackPhaseComplete()) {
      $(this).hide()
    }
  })

  $('#reset').on('click.reset', function () {
    console.log('resetting game')

    // empty all divs before resetting the game
    emptyDivs()

    // hide reset button
    $(this).hide()

    // start the game again
    startGame()
  })

  // KICKS OFF THE GAME
  startGame()
})