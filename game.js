var player;
var playerBullets = [];
var playerShootingSpeed = 10;
var playerBulletsLimit = 3;
var score = 0;

var block_dimensions = 30;
var block_move_distance = block_dimensions + (block_dimensions / 3);

var enemies = [];
var enemyBullets = [];
var enemyShootingRate = 200;
var shootingRateIncrease = 30;
var enemyShootingSpeed = 6;


function startGame() {
    player = new component(block_dimensions, block_dimensions, "blue", 325, 315);
    game_over = document.getElementById("game_over");
    reset_game = document.getElementById("reset_game");
    start = Date.now();
    myGameArea.start();
}


var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 680;
        this.canvas.height = 350;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 30);
        enemyInterval = setInterval(enemyShots, enemyShootingRate);

        for (i = 5; i < this.canvas.width - block_dimensions; i += block_dimensions + (block_dimensions / 3)) {
            enemies.push(new component(block_dimensions, block_dimensions, "red", i, 10));
        }
        window.addEventListener("keyup", function (event) {
            // Press the Spacebar to shoot.
            if (event.keyCode == "32" && playerBullets.length < playerBulletsLimit) {
                playerBullets.push(new component(5, 5, "black", (player.x + (.4333 * block_dimensions)), player.y)
                );
            }
        })
        window.addEventListener("keydown", function (event) {
            // Press the left arrow to move the player left.
            if (event.keyCode == "37" && player.x > block_move_distance - (block_dimensions / 3)) {
                player.x -= block_move_distance;
            }
        })
        window.addEventListener("keydown", function (event) {
            // Press the right arrow to move the player right.
            if (event.keyCode == "39" && player.x < myGameArea.canvas.width - (block_move_distance + block_dimensions)) {
                player.x += block_move_distance;
            }
        })
        reset_game.addEventListener("click", resetGame);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    this.playerHitsEnemy = function (enemy) {
        crash = false;
        enemyY = enemy.y + enemy.height;
        enemyLeft = enemy.x;
        enemyRight = enemy.x + enemy.width;
        if (this.y <= enemyY && this.x <= enemyRight &&
            this.x >= enemyLeft) {
            crash = true;
            console.log((enemies.length - 1) + " enemies remaining");
        }
        return crash;
    }

    this.enemyHitsPlayer = function () {
        crash = false;
        playerLeft = player.x;
        playerRight = player.x + player.width;
        playerBottom = player.y + player.height;
        if (this.y >= player.y && this.y <= playerBottom && this.x <= playerRight && this.x >= playerLeft) {
            crash = true;
        }
        return crash;
    }


}

function enemyShots() {
    var whoShoots = Math.floor(Math.random() * enemies.length);
    shooter = enemies[whoShoots];
    if (enemies.length > 0) {
        enemyBullets.push(new component(5, 5, "green", (shooter.x + (.4333 * block_dimensions)), (shooter.y + shooter.height)));
    }
}

function updateGameArea() {
    myGameArea.clear();
    updateTimer();
    if (myGameArea.x && myGameArea.y) {
        player.x = myGameArea.x;
        player.y = myGameArea.y;
    }

    for (i = 0; i < playerBullets.length; i += 1) {
        this.playerBullets[i].y -= playerShootingSpeed;
        playerBullets[i].update();
        if (playerBullets[i].y < 0) {
            playerBullets.shift();
        }

        for (j = 0; j < enemies.length; j += 1) {
            if (playerBullets[i] != undefined && playerBullets[i].playerHitsEnemy(enemies[j])) {
                clearInterval(enemyInterval);
                enemyShootingRate += shootingRateIncrease;
                enemyInterval = setInterval(enemyShots, enemyShootingRate);
                enemies.splice(j, 1);
                playerBullets.shift();
            }
        }
    }

    for (i = 0; i < enemyBullets.length; i += 1) {
        this.enemyBullets[i].y += enemyShootingSpeed;
        if (enemyBullets[i].y > myGameArea.canvas.height) {
            enemyBullets.shift();
        }
        enemyBullets[i].update();
        if (enemyBullets[i].enemyHitsPlayer()) {
            user_wins = false;
            endGame(user_wins);
        }
    }

    for (i = 0; i < enemies.length; i += 1) {
        enemies[i].update();
    }

    player.update();
    if (enemies.length == 0) {
        user_wins = true;
        endGame(user_wins);
    }
}

function resetGame() {
    location.reload();
}

function endGame(user_wins) {
    finalScore = updateTimer();
    myGameArea.canvas.height = 0;
    myGameArea.canvas.width = 0;
    enemyBullets.splice(0, enemyBullets.length);
    clearInterval(enemyInterval);
    clearInterval(myGameArea.interval);
    if (user_wins) {
        game_over.innerHTML = "You win! Add your name to the leaderboard below.";
        document.getElementById("form_display").type = "text";
        document.getElementById("final_score").value = finalScore;
        document.getElementById("form_submit").type = "submit";
    }
    else {
        game_over.innerHTML = "You lose! Would you like to play again?";
    }
    reset_game.innerHTML = "Play again";
}


function updateTimer() {
    end = Date.now();
    elapsed = end - start;
    score += elapsed;
    score_display = document.getElementById("score");
    score_display.innerHTML = "Time: " + score / 1000;
    start = Date.now();
    return score / 1000;
}

window.onload = startGame;