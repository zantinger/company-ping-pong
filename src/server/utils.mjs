export const ballCollision = (player, ball) => {
  const playerTop = player.y;
  const playerRight = player.x + player.width;
  const playerBottom = player.y + player.height;
  const playerLeft = player.x;
  const radius = Math.round(ball.radius / 2);

  const ballTop = ball.y - radius;
  const ballRight = ball.x + radius;
  const ballBottom = ball.y + radius;
  const ballLeft = ball.x - radius;

  // true or false
  return (
    ballLeft < playerRight &&
    ballTop < playerBottom &&
    ballRight > playerLeft &&
    ballBottom > playerTop
  );
};

export const getRandomInt = (min, max) => {
  // The maximum is exclusive and the minimum is inclusive
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};
