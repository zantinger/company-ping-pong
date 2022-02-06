// Game

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const netWidth = 4;
const netHeight = canvas.height;

const paddleWidth = 10;
const paddleHeight = 100;


const net = {
  x: canvas.width / 2 - netWidth / 2,
  y: 0,
  width: netWidth,
  height: netHeight,
  color: "#FFF",
};

let player1 = {
  position: [0,0],
  width: paddleWidth,
  height: paddleHeight,
  color: '#FFF',
  score: 0,
};

let player2 = {
  ...player1,
};

let ball = {
  position: [0,0],
  radius: 7,
  speed: 7,
  color: '#05EDFF'
};


function drawNet() {
  ctx.fillStyle = net.color;

  // syntax --> fillRect(x, y, width, height)
  ctx.fillRect(net.x, net.y, net.width, net.height);
}

function drawScore(x, y, score) {
  ctx.fillStyle = '#fff';
  ctx.font = '35px sans-serif';

  // syntax --> fillText(text, x, y)
  ctx.fillText(score, x, y);
}

function drawPaddle(player) {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.position[0], player.position[1], player.width, player.height);
}

function drawBall(position, radius, color) {
  // console.log('pos ', position)
  ctx.fillStyle = color;
  ctx.beginPath();
  // syntax --> arc(x, y, radius, startAngle, endAngle, antiClockwise_or_not)
  ctx.arc(position[0], position[1], radius, 0, Math.PI * 2, true); // π * 2 Radians = 360 degrees
  ctx.closePath();
  ctx.fill();
}

function reset() {
  // reset ball's value to older values
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = 7;

  // changes the direction of ball
  ball.velocityX = -ball.velocityX;
  ball.velocityY = -ball.velocityY;
}

// collision Detect function
function collisionDetect(player, ball) {
  // returns true or false
  player.top = player.y;
  player.right = player.x + player.width;
  player.bottom = player.y + player.height;
  player.left = player.x;

  ball.top = ball.y - ball.radius;
  ball.right = ball.x + ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;

  return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
}

// update function, to update things position
function update() {
  // move the paddle
  // if (player1.upArrowPressed && player1.y > 0) {
  //   player1.y -= 8;
  // } else if (player1.downArrowPressed && (player1.y < canvas.height - player1.height)) {
  //   player1.y += 8;
  // }
  // if (player2.upArrowPressed && player2.y > 0) {
  //   player2.y -= 8;
  // } else if (player2.downArrowPressed && (player2.y < canvas.height - player2.height)) {
  //   player2.y += 8;
  // }

  // // check if ball hits top or bottom wall
  // if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
  //   ball.velocityY = -ball.velocityY;
  // }

  //  // if ball hit on right wall
  //  if (ball.x + ball.radius >= canvas.width) {
  //   // then user scored 1 point
  //   player1.score += 1;
  //   reset();
  // }

  // // if ball hit on left wall
  // if (ball.x - ball.radius <= 0) {
  //   // then player2 scored 1 point
  //   player2.score += 1;
  //   reset();
  // }

  // // move the ball
  // ball.x += ball.velocityX;
  // ball.y += ball.velocityY;

  // // player2 paddle movement
  // // player2.y += ((ball.y - (player2.y + player2.height / 2))) * 0.09;

  // // collision detection on paddles
  // let player = (ball.x < canvas.width / 2) ? player1 : player2;

  // if (collisionDetect(player, ball)) {
  //   // default angle is 0deg in Radian
  //   let angle = 0;

  //   // if ball hit the top of paddle
  //   if (ball.y < (player.y + player.height / 2)) {
  //     // then -1 * Math.PI / 4 = -45deg
  //     angle = -1 * Math.PI / 4;
  //   } else if (ball.y > (player.y + player.height / 2)) {
  //     // if it hit the bottom of paddle
  //     // then angle will be Math.PI / 4 = 45deg
  //     angle = Math.PI / 4;
  //   }

  //   /* change velocity of ball according to on which paddle the ball hitted */
  //   ball.velocityX = (player === player1 ? 1 : -1) * ball.speed * Math.cos(angle);
  //   ball.velocityY = ball.speed * Math.sin(angle);

  //   // increase ball speed
  //   ball.speed += 0.2;
  // }
}

// render function draws everything on to canvas
function render() {
  // set a style
  ctx.fillStyle = "#000"; /* whatever comes below this acquires black color (#000). */
  // draws the black board
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw net
  drawNet();
  // draw user score
  drawScore(canvas.width / 4, canvas.height / 6, player1.score);
  // draw player2 score
  drawScore(3 * canvas.width / 4, canvas.height / 6, player2.score);
  // draw user paddle
  // console.log('player1: ', player1)
  drawPaddle(player1)
  drawPaddle(player2)
  // draw ball
  drawBall(ball.position, ball.radius, ball.color);
}

// gameLoop
function gameLoop() {
  // update();
  render();
  requestAnimationFrame(gameLoop)
}

const runPingPong = gameLoop

const getPlayerData = () => ({player1, player2, ball}) 

const setPlayerData = (position) => {
  console.log('position: ', position)
  console.log('position: ', typeof position)
  player1 = {...player1, position}
}


export {
  runPingPong,
  getPlayerData,
  setPlayerData
}
