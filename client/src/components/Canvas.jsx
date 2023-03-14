import { fromEvent } from "rxjs";
import { useSocketEmiter, useSocketListener } from "../utils.js";
import { useRef, useEffect } from "react";

const keydown$ = fromEvent(window, "keydown");

const Canvas = () => {
  const canvasRef = useRef(null);
  const pingPong = useSocketListener("game data", undefined);

  useEffect(() => {
    if (!pingPong) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    draw(context, pingPong);
  }, [pingPong]);

  useSocketEmiter(keydown$, ({ socket, data: { code } }) => {
    socket.emit("key pressed", { code });
  });

  return (
    <div>
      {!pingPong ? (
        <p>Press Enter to start game</p>
      ) : (
        <canvas
          width={pingPong.area.width}
          height={pingPong.area.height}
          ref={canvasRef}
        />
      )}
    </div>
  );
};

export default Canvas;

const draw = (ctx, { area, player1, player2, ball, score }) => {
  // clear canvas
  ctx.clearRect(0, 0, area.width, area.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, area.width, area.height);

  // score
  ctx.font = score.font;
  ctx.fillStyle = score.color;
  ctx.fillText(score.player1, area.width / 2 - 30, 40);
  ctx.fillText(score.player2, area.width / 2 + 10, 40);

  // player1
  ctx.fillStyle = player1.color;
  ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

  // // player2
  ctx.fillStyle = player2.color;
  ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

  // ball
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  // syntax --> arc(x, y, radius, startAngle, endAngle, antiClockwise_or_not)
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true); // π * 2 Radians = 360 degrees
  ctx.closePath();
  ctx.fill();
};
