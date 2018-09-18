$(document).ready(function() {


var characters = {
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
};

var currSelChar;
var combatants = [];

var renderOne = function(character, renderArea) {
    var charDiv = $("<div class='character' data-name='" + character.name + "'>");
    var charName = $("<div class='character-name'>").text(character.name);
    var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
    var charHealth = $("<div class='character-health'>").text(character.health);
    charDiv.append(charName).append(charImage).append(charHealth);
    $(renderArea).append(charDiv);
}

var renderCharacters = function(charObj, areaRender) {
    if (areaRender === "#characters") {
        $(areaRender).empty();
        for (var key in charObj) {
            if(charObj.hasOwnProperty(key)) {
                renderOne(charObj[key], areaRender);
            }
        }
    }
    

    if (areaRender === "#your-character") {
        renderOne(charObj, areaRender);
    }
    if (areaRender === "#enemies") {
        for (var i = 0; i < charObj.length; i++) {
            renderOne(charObj[i], areaRender);
        }
    }
}

renderCharacters(characters, "#characters");

$(document).on("click", ".character", function() {
    var name = $(this).attr("data-name");
    
    if (!currSelChar) {
        for (var key in characters) {
            if (key != name) {
                combatants.push(characters[key]);
            }
        }
        console.log(combatants);
        $("#characters").hide();
        renderCharacters(currSelChar, "#your-character");
        renderCharacters(combatants, "#enemies")

    }
    });
});

