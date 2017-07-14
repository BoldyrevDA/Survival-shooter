var requestAnimFrame = (function () {
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var fieldPattern;
var gameTime = 0;
var lastTime;
var lastFire = Date.now();
var isGameOver;

var bullets = [];
var enemies = [];
var deathEnemies = [];

var score = 0;
var scoreEl = document.getElementById('score');

var enemySpeed = 40;
var playerSpeed = 200;
var bulletSpeed = 500;

var player = {
    angle: 4.71,
    sprite: new Sprite('img/player.png', [0, 0], [44, 22], [canvas.width/2, canvas.height/2], 5, [0, 2, 1, 2])
};

function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    
    
    if(!isGameOver){
        update(dt);
        render();
    }
    
    lastTime = now;
    requestAnimFrame(main);
}


function init() {
    fieldPattern = ctx.createPattern(resources.get('img/field.png'), 'repeat');
    ctx.fillStyle = fieldPattern;
    
    document.getElementById('play-again').addEventListener('click', function() {
        reset();
    });
    
    reset();
    lastTime = Date.now();
    main();
}

resources.load([
    'img/bullet.png',
    'img/enemy.png',
    'img/enemy_death.png',
    'img/field.png',
    'img/player.png'
]);
resources.onReady(init);

function update(dt) {
    
    gameTime += dt;
    
    handleInput(dt);
    
    updateEntities(dt);
    
    var x = 0, 
        y = 0;
    var rand;
    if(Math.random()*1.8 < 1 - Math.pow(.999, gameTime)) {
        rand = specificRandomInteger(1,4);
        
        if(rand == 1) {
            x = Math.random() * canvas.width;
            y = -76;
        }
        else if(rand == 2) {
            x = canvas.width;
            y = Math.random() * canvas.height;
        }
        else if(rand == 3) {
            x = Math.random() * canvas.width;
            y = canvas.height;
        }
        else if(rand == 4) {
            x = -92;
            y = Math.random() * canvas.height;
        }
        
        enemies.push({
            angle: 0,
            sprite: new Sprite('img/enemy.png', [0, 0], [69, 57], [x, y], 5, [0, 1, 2, 3, 4, 5])
        });
    }
    
    //checkPlayerBounds();
    checkCollisions();
    scoreEl.innerHTML = score;
}

function specificRandomInteger(min, max) {
  var rand = min + Math.random() * (max - min)
  rand = Math.round(rand);
  return rand;
}

function handleInput(dt) {
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.sprite.position[0] -= playerSpeed * dt * Math.cos(player.angle);
        player.sprite.position[1] -= playerSpeed * dt * Math.sin(player.angle);
        player.sprite.update(dt);
    }

    if(input.isDown('UP') || input.isDown('w')) {
        player.sprite.position[0] += playerSpeed * dt * Math.cos(player.angle);
        player.sprite.position[1] += playerSpeed * dt * Math.sin(player.angle);
        player.sprite.update(dt);
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        player.angle -= playerSpeed/32 * dt;
        player.sprite.update(dt);
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        player.angle += playerSpeed/32 * dt;
        player.sprite.update(dt);
    }
    
    if(input.isDown('SPACE') && Date.now() - lastFire > 190) {
        var alignment = 4;
        var x = player.sprite.position[0] + player.sprite.size[0] / 2 - alignment;
        alignment = 3;
        var y = player.sprite.position[1] + player.sprite.size[1] / 2 - alignment;
        bullets.push({ angle: player.angle,
                       sprite: new Sprite('img/bullet.png', [0, 0], [8, 6], [x, y]) });
        lastFire = Date.now();
    }
}

function updateEntities(dt){
    
    for(var i=0; i<bullets.length; i++) {
        var bullet = bullets[i];
        
        bullet.sprite.position[0] += bulletSpeed * dt * Math.cos(bullet.angle);
        bullet.sprite.position[1] += bulletSpeed * dt * Math.sin(bullet.angle);

        if(bullet.sprite.position[1] < 0 || bullet.sprite.position[1] > canvas.height ||
           bullet.sprite.position[0] > canvas.width || bullet.sprite.position[0] < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
    
    for(var i=0; i<enemies.length; i++) {
        calculateAngleEnemy(enemies[i]);
        enemies[i].sprite.update(dt);
        enemies[i].sprite.position[0] += enemySpeed * dt * Math.cos(enemies[i].angle);
        enemies[i].sprite.position[1] += enemySpeed * dt * Math.sin(enemies[i].angle);
    }
    
    for(var i=0; i<deathEnemies.length; i++) {
        if(!deathEnemies[i].sprite.done){
        deathEnemies[i].sprite.update(dt);
        }

        /*if(deathEnemies[i].sprite.done) {
            deathEnemies.splice(i, 1);
            i--;
        }*/
    }
    
}

function calculateAngleEnemy(enemy)
{
    var xPlayer = player.sprite.position[0] + player.sprite.size[0]/2,
        yPlayer = player.sprite.position[1]  + player.sprite.size[1]/2,
        xEnemy = enemy.sprite.position[0] + enemy.sprite.size[0]/2,
        yEnemy = enemy.sprite.position[1] + enemy.sprite.size[1]/2;

    enemy.angle = Math.atan2(yPlayer - yEnemy, xPlayer - xEnemy);
}


function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    var alignment = 52;
    return collides(pos[0] + pos[0] / alignment, pos[1] + pos[1] / alignment,
                    pos[0] + size[0] - size[0] / alignment, pos[1] + size[1] - size[1] / alignment,
                    pos2[0] + pos2[0] / alignment, pos2[1] + pos2[1] / alignment,
                    pos2[0] + size2[0] - size2[0] / alignment, pos2[1] + size2[1] - size2[1] / alignment);
    /*return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);*/
}

function checkCollisions() {
    checkPlayerBounds();
    
    for(var i=0; i<enemies.length; i++) {
        var pos = enemies[i].sprite.position;
        var size = enemies[i].sprite.size;

        for(var j=0; j<bullets.length; j++) {
            var pos2 = bullets[j].sprite.position;
            var size2 = bullets[j].sprite.size;

            if(boxCollides(pos, size, pos2, size2)) {

                score += 10;

                deathEnemies.push({
                    angle: enemies[i].angle,
                    sprite: new Sprite('img/enemy_death.png', [0, 0], [85, 57], pos, 14, [0, 1, 2, 3, 4, 5], 1, true)
                });
                
                enemies.splice(i, 1);
                i--;
                bullets.splice(j, 1);
                break;
            }
        }

        
        if(boxCollides(pos, size, player.sprite.position, player.sprite.size)) {
            gameOver();
        }
    }
}

function checkPlayerBounds() {
    if(player.sprite.position[0] < 0) {
        player.sprite.position[0] = 0;
    }
    else if(player.sprite.position[0] > canvas.width - player.sprite.size[0]) {
        player.sprite.position[0] = canvas.width - player.sprite.size[0];
    }

    if(player.sprite.position[1] < 0) {
        player.sprite.position[1] = 0;
    }
    else if(player.sprite.position[1] > canvas.height - player.sprite.size[1]) {
        player.sprite.position[1] = canvas.height - player.sprite.size[1];
    }
}

function render(){
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    renderEntities(deathEnemies);
    renderEntities(bullets);
    renderEntities(enemies);
    
    renderEntity(player);
}

function renderEntities(list){
    for(var i=0; i<list.length; i++) {
        renderEntity(list[i]);
    }
}

function renderEntity(entity){
    var dx = entity.sprite.position[0] + entity.sprite.size[0] / 2;
    var dy = entity.sprite.position[1] + entity.sprite.size[1] / 2;
    var a = entity.angle;// * (Math.PI / 180);
    
    ctx.save();
    
    ctx.translate(dx, dy);
    ctx.rotate(a);
    ctx.translate(-dx, -dy);  
    
    entity.sprite.render(ctx);
    ctx.restore();
}




function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
}


function reset() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    isGameOver = false;
    gameTime = 0;
    score = 0;

    enemies = [];
    bullets = [];
    deathEnemies = [];
    //enemies.push(enemy);
    
    player.angle = 4.71;
    player.sprite.position = [canvas.width / 2, canvas.height / 2];
};
