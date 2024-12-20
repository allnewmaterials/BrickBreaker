/***************
 POMENBNE SPREMENLJIVKE OZ. KONSTANTE
 ***************/

let canvas = document.getElementById("game-canvas");
let ctx = canvas.getContext("2d");
let ballRadius = 4;
let x = canvas.width/2;
let y = canvas.height-10-ballRadius;
let dx = 1;
let dy = -1;
let mouseDown = false;
let lastMouseX = 0; 
let paddleHeight = 6;
let paddleWidth = 50;
let paddleX = (canvas.width-paddleWidth)/2;
let paddleMoveSpeed = 2;
let rightPressed = false;
let leftPressed = false;
let brickColumnCount = 10;
let brickRowCount = 10;
let brickWidth = 25;
let brickHeight = 6;
let brickPadding = 4;
let brickOffsetTop = brickHeight*2;
let brickOffsetLeft = 7;
let rightKey = "d";
let leftKey = "s";
let score = 0;
let lives = 3;
let gameColor = "#e53935";
let brickColor1 = "#4cbb17";
let brickColor2 = "#0f52ba";
let brickColor3 = gameColor;
let animm;
let gameState = 'playing'; // Possible states: 'start', 'playing', 'levelTransition', 'gameOver', 'pause', "gameWon", "modal"
let level = 1;
const maxLevel = 3; // 1 is for testing, 3 is the real number
let bricks = [];

let lvlTEST = [[1,0,0,0], [0,0,0,0]];

let lvl1 = [
	[1,0,0,0,0,0,0,0,0,1],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,1,1,1,1,1,1,0,0],
	[1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,1],

	];
let lvl2 = [
	[1,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,2,2,1,1,1],
	[1,1,1,2,2,2,2,1,1],
	[1,1,2,2,2,2,2,2,1],
	[1,2,2,2,2,2,2,2,1],
	[2,2,2,2,2,2,2,2,1],
	[1,2,2,2,2,2,2,2,1],
	];

let lvl3 = [ 
	[3,1,2,2,1,1,1,1,3],
	[1,3,2,2,1,1,1,3,1],
	[3,1,2,2,1,1,1,1,3],
	[1,3,2,2,1,1,1,3,1],
	[3,1,2,2,1,1,1,1,3],
	[1,3,2,2,1,1,1,3,1],
	[3,1,2,2,1,1,1,1,3],
	[1,3,2,2,1,1,1,3,1],
	[3,1,2,2,1,1,1,1,3],
	[1,1,2,2,1,1,1,3,1],
	];

/**********
 MAIN LOOP
 **********/

function main(){
  if (gameState == 'playing') {
    draw();
    movement();
		hasCleared();
    animm = requestAnimationFrame(main);
    
  } else if (gameState == 'start') {

  } else if (gameState == 'levelTransition') {
    levelTransition();
  } else if (gameState == 'gameOver') {
    gameOver();
  } else if(gameState == "pause"){
  
  } else if(gameState == "gameWon"){
  	gameWon();
  } 
}

function hasCleared(){
	for(let c = 0; c < bricks.length; c++) {
    for(let r = 0; r < bricks[c].length; r++) {
    	if (bricks[c][r].status != 0) {
    		return;
    	}
    }
  }
  // if the bricks have been cleared
  if(level < maxLevel){
  	gameState = "levelTransition";
  	console.log("level cleared");
  }
  else if (level == maxLevel){
  	gameState = "gameWon";
  	console.log("game cleared");
  }
}

function gameOver(){
	document.getElementById("canvas-cover-text").innerHTML = "You  Died!"
	document.getElementById("canvas-cover-button").innerHTML = "RESTART";
  document.getElementById("canvas-cover-button").onclick = () => {  gameReset();};
	canvascovermodal.style.display = '';
	document.getElementById("canvas-cover-button").style.display = '';
}

function levelTransition() {
	document.getElementById("canvas-cover-text").innerHTML = "Level  " + level + "  CLEAR";
	document.getElementById("canvas-cover-button").style.display = 'none';
	canvascovermodal.style.display = '';
  lives = 3;
  level++;
  
  x = canvas.width/2;
  y = canvas.height-10-ballRadius;
  dx = 1;
  dy = -1;
  paddleX = (canvas.width-paddleWidth)/2;
  createBricks();
  draw();
  setTimeout(() => { canvascovermodal.style.display = 'none'; gameState = "pause";}, 2000);
}

function gameReset(){
	document.getElementById("canvas-cover-text").innerHTML = "BrickBreaker!";
	document.getElementById("canvas-cover-button").innerHTML = "START";
  document.getElementById("canvas-cover-button").onclick = () => {startGame();};
	canvascovermodal.style.display = '';
  score = 0;
  lives = 3;
  level = 1;
  bricks = [];
  x = canvas.width/2;
  y = canvas.height-10-ballRadius;
  dx = 1;
  dy = -1;
  paddleX = (canvas.width-paddleWidth)/2;

  createBricks();
  draw();

  gameState = "start";
}

function gameWon() {
	document.getElementById("canvas-cover-text").innerHTML = "You have won!"
	document.getElementById("canvas-cover-button").innerHTML = "RESTART";
  document.getElementById("canvas-cover-button").onclick = () => {  gameReset();};
	canvascovermodal.style.display = '';
	document.getElementById("canvas-cover-button").style.display = '';
}

/*********
 COLLISION
 *********/

function brickCollision() {
  for(let c = 0; c < bricks.length; c++) {
    for(let r = 0; r < bricks[c].length; r++) {
      if(bricks[c][r].status != 0) {
        if(x + dx >= bricks[c][r].x - ballRadius && 
        	 x + dx <= bricks[c][r].x + brickWidth+ballRadius &&
        	 y + dy >= bricks[c][r].y - ballRadius &&
        	 y + dy <= bricks[c][r].y + brickHeight + ballRadius) {
	          // Determine which side the ball hit
	          let ballTop = y + dy - bricks[c][r].y;             
	          let ballBottom = (bricks[c][r].y + brickHeight) - (y + dy); 
	          let ballLeft = x + dx - bricks[c][r].x;           
	          let ballRight = (bricks[c][r].x + brickWidth) - (x + dx);
	          
	          // Find the side with the minimum distance (closest collision)
	          let minDistance = Math.min(ballTop, ballBottom, ballLeft, ballRight);

	          if (minDistance === ballTop || minDistance === ballBottom) {
	            dy = -dy; // Top or bottom hit
	          } 
	          if (minDistance === ballLeft || minDistance === ballRight) {
	            dx = -dx; // Left or right hit
	          }
	          bricks[c][r].status -= 1;
	          score++;
	          playBreak();
	          console.log("the score is" + score);
	      }
      }
    }
  }
}

/*******
 MOVEMENT
 *******/

function movement(){
	ballMovement();
	paddleMovement();
}

function ballMovement(){
	// Paddle hit
	if (y + dy > canvas.height - ballRadius - paddleHeight) {
	  if (x + dx > paddleX && x + dx < paddleX + paddleWidth) {
	 			if(x + dx + ballRadius >= paddleX){

		    let paddleCenter = paddleX + paddleWidth/2;
		    let hitPosition = (x - paddleCenter) / (paddleWidth/2);

		    dx = hitPosition * 2;
		    dy = -dy; 
	  	}
	  }
	}
  // side canvas hit
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  // top canvas hit
  if(y + dy < ballRadius) {
    dy = -dy;
  }
  // bottom canvas hit
  else if(y + dy > canvas.height-ballRadius) {
    if(!(x > paddleX && x < paddleX + paddleWidth)) {
      lives--;
      drawLives();
      if(lives <= 0) {
        gameState = "gameOver";
      }
      else {
        x = canvas.width/2;
        y = canvas.height-10-ballRadius;
        dx = 1;
        dy = -1;
        paddleX = (canvas.width-paddleWidth)/2;
        draw();
        gameState = "pause";
      }
    }
  }

  brickCollision();

	x += dx;
  y += dy;

}

function paddleMovement(){
	if(rightPressed && paddleX < canvas.width-paddleWidth) {
   	paddleX += paddleMoveSpeed;
  }
  else if(leftPressed && paddleX > 0) {
   	paddleX -= paddleMoveSpeed;
  }

}

/*******
 KEYBOARD&MOUSE EVENTS
 *******/
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mousedown", (e) => {mouseDown = true; lastMouseX = e.clientX;}, false);
document.addEventListener("mouseup", (e) => {mouseDown = false;}, false);

function keyDownHandler(e) {
  if(e.key == rightKey) {
  	console.log('rightdown');
    rightPressed = true;
    if (gameState == 'pause') {
      currentLevel = 1;
      gameState = 'playing';
      main();
    }
  }
  else if(e.key == leftKey) {
    console.log('leftdown');
    leftPressed = true;
    if (gameState == 'pause') {
      currentLevel = 1;
      gameState = 'playing';
      main();
    }
  }
}

function keyUpHandler(e) {
  if(e.key == rightKey) {
  	console.log('rightup');
    rightPressed = false;
  }
  else if(e.key == leftKey) {
  	console.log('leftup');
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
   if (!mouseDown) return; 

  let diffX = e.clientX - lastMouseX; // mouse movement since last frame
  lastMouseX = e.clientX; // update mouse position

  paddleX += diffX / 4;

  // prevent paddle from going outside canvas
  if (paddleX < 0) paddleX = 0;
  if (paddleX + paddleWidth > canvas.width) 
  	paddleX = canvas.width - paddleWidth;

  if (gameState == 'pause') {
      currentLevel = 1;
      gameState = 'playing';
      main();
    }
}
/*********
 RISANJE
 *********/

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPaddle();
	drawBricks();
	drawBall();
	drawScore();
	drawLives();	
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = gameColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = gameColor;
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for(let c = 0; c < bricks.length; c++) {
    for(let r = 0; r < bricks[c].length; r++) {
      if(bricks[c][r].status != 0) {
        ctx.beginPath();
        ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
        switch (bricks[c][r].status) {
        	case 1:
        		ctx.fillStyle = brickColor1;
        		break;
        	case 2:
        		ctx.fillStyle = brickColor2;
        		break;
        	case 3:
        		ctx.fillStyle = brickColor3;
        }        
        ctx.fill();
        ctx.closePath();
        //console.log('printed brick')
      }
    }
    //console.log('printed row')
  }
  //console.log('printed table')
}

function createBricks () {
	let currlvl;	
	let currx = 0, curry = 0;
	if (level == 1) {
		currlvl = lvl1;
	}
	else if (level == 2) {
		currlvl = lvl2;
	}
	else if (level == 3) {
		currlvl = lvl3;
	}

	bricks = [];
	for(let c = 0; c < currlvl.length; c++)
  bricks[c] = [];

	for (let c = 0; c < currlvl.length; c++) {
		for (let r = 0; r < currlvl[c].length; r++) {
			let currx = (c*(brickWidth+brickPadding))+brickOffsetLeft;
      let curry = (r*(brickHeight+brickPadding))+brickOffsetTop;
			bricks[c][r] = { x: currx, y: curry, status: currlvl[c][r]};
		}
	}

}
function drawText(text, xpos, ypos, fontsize, font, color) {
  ctx.font = fontsize + " " + font;
  ctx.fillStyle = color;
  ctx.fillText(text, xpos, ypos);
}

function drawScore(){
	document.getElementById("score").innerHTML = "Score: " + score;

}

function drawLives(){
	document.getElementById("lives").innerHTML = "Lives: " + lives;
}


/**********
 RANDOM ASS FUNCTIONS
 **********/

window.onload = function(){
  createBricks();
  main();
  gameState = "start";
}
