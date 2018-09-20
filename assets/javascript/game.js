$(document).ready(function () {
    
    var characters = {
        "WALLY": {
            name: "WALLY",
            health: 120,
            attack: 8,
            imageUrl: "assets/images/wally.png",
            enemyAttackBack: 15
        },
        "ANDRE": {
            name: "ANDRE",
            health: 100,
            attack: 14,
            imageUrl: "assets/images/andre.png",
            enemyAttackBack: 5
        },
        "BARTENDER": {
            name: "BARTENDER",
            health: 150,
            attack: 8,
            imageUrl: "assets/images/bartender.png",
            enemyAttackBack: 5
        },
        "WAITER": {
            name: "WAITER",
            health: 180,
            attack: 7,
            imageUrl: "assets/images/waiter2.png",
            enemyAttackBack: 25
        }
    };

    var currSelChar;
    var combatants = [];
    var currDefender;
    var turnCounter = 1;
    var killCount = 0;

    var renderOne = function (character, renderArea, charStatus) {
        var charDiv = $("<div class='character' data-name='" + character.name + "'>");
        var charName = $("<div class='character-name'>").text(character.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
        var charHealth = $("<div class='character-health'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);

        if (charStatus === "enemy") {
            $(charDiv).addClass("enemy");
        }
        else if (charStatus === "defender") {
            currDefender = character;
            $(charDiv).addClass("target-enemy");
        }
    };

    var renderMessage = function(message) {
        var gameMessageSet = $("#message");
        var newMessage = $("<div id='new-message'>").text(message);
        gameMessageSet.append(newMessage);
        
        if (message === "clearMessage") {
            gameMessageSet.text("");
        }
    }

    var renderCharacters = function (charObj, areaRender) {
        if (areaRender === "#character-section") {
            $(areaRender).empty();
            for (var key in charObj) {
                if (charObj.hasOwnProperty(key)) {
                    renderOne(charObj[key], areaRender, "");
                }
            }
        }

        if (areaRender === "#your-character") {
            renderOne(charObj, areaRender, "");
        }

        if (areaRender === "#enemies") {
            for (var i = 0; i < charObj.length; i++) {
                renderOne(charObj[i], areaRender, "enemy");
            }
        }
         $(document).on("click", ".enemy", function() {
                var name = ($(this).attr("data-name"));
                
                if ($("#defender").children().length === 0) {
                    renderCharacters(name, "#defender");
                    $(this).hide();
                    renderMessage("clearMessage");
                }
            });
        

        if (areaRender === "#defender") {
            $(areaRender).empty();
            for (var i = 0; i < combatants.length; i++) {
                if (combatants[i].name === charObj) {
                    renderOne(combatants[i], areaRender, "defender");
                }
            }
        }

        if (areaRender === "playerDamage") {
            $("#defender").empty();
            renderOne(charObj, "#defender", "defender");
        }

        if (areaRender === "enemyDamage") {
            $("#your-character").empty();
            renderOne(charObj, "#your-character", "");
        }

        if (areaRender === "enemyDefeated") {
            $("#defender").empty();
            var gameStateMessage = "You have defeated " + charObj.name + " in a battle of wit, erudition, and ripostes. You can choose to disputate informally with another conversant.";
            renderMessage(gameStateMessage);
        }
    }
    
    var restartGame = function(inputEndGame) {
        var restart = $("<button>Return with l'escalier d'esprit</button>").click(function() {
            location.reload();
        });

        var gameState = $("<div>").text(inputEndGame);

        $("#message").append(gameState);
        $("#message").append(restart);
    }
      
    renderCharacters(characters, "#character-section");

    $(document).on("click", ".character", function () {
        var name = $(this).attr("data-name");
         //console.log(typeof name);
        
        //console.log(name);

        if (!currSelChar) {
            currSelChar = characters[name];
           // console.log(currSelChar);

            for (var key in characters) {
                if (key !== name) {
                    combatants.push(characters[key]);
                }
            }

            $("#character-section").hide();
            
            renderCharacters(currSelChar, "#your-character");
            renderCharacters(combatants, "#enemies");
        }
    });

    $("#attack").on("click", function() {

        if ($("#defender").children().length !== 0) {
            var attackMessage = "You attacked " + currDefender.name + " for " + (currSelChar.attack * turnCounter) + " pangs of ego damage.";
            var counterAttackMessage = currDefender.name + " vollied a bon mot at you for " + currDefender.enemyAttackBack + " points of damage to the integrity of your self-conception.";
            renderMessage("clearMessage");

            currDefender.health -= (currSelChar.attack * turnCounter);
            
            if (currDefender.health > 0) {

                renderCharacters(currDefender, "playerDamage");

                renderMessage(attackMessage);
                renderMessage(counterAttackMessage);

                currSelChar.health -= currDefender.enemyAttackBack;
                renderCharacters(currSelChar, "enemyDamage");
            

            if (currSelChar.health <= 0) {
                renderMessage("clearMessage")
                restartGame("You're not as smart as you think.");
                $("#attack").unbind("click");
            }
        }
        
            else {
                renderCharacters(currDefender, "enemyDefeated");
                killCount++;
                if (killCount >= 3) {
                    renderMessage("clearMessage");
                    restartGame("You are the cock of the intellegentsia's walk. Bask in your elitist glory.")
                    $("#attack").unbind("click");
                }
            }
        }
        turnCounter++;
    });
 });