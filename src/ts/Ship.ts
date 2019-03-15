export function drawShip(
  ctx: CanvasRenderingContext2D,
  radius: number,
  guide = false,
  angle = 0.5 * Math.PI,
  lineWidth = 2,
  stroke = "white",
  fill = "black",
  tailCurve = 0.25,
  sideCurve = 0.75
) {
  let shipAngle = angle / 2;
  ctx.save();

  if (guide) {
    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fill;

  ctx.beginPath();
  ctx.moveTo(radius, 0);

  ctx.quadraticCurveTo(
    Math.cos(shipAngle) * radius * sideCurve,
    Math.sin(shipAngle) * radius * sideCurve,
    Math.cos(Math.PI - shipAngle) * radius,
    Math.sin(Math.PI - shipAngle) * radius
  );

  ctx.quadraticCurveTo(
    -radius * tailCurve,
    0,
    Math.cos(Math.PI + shipAngle) * radius,
    Math.sin(Math.PI + shipAngle) * radius
  );

  ctx.quadraticCurveTo(
    Math.cos(-shipAngle) * radius * sideCurve,
    Math.sin(-shipAngle) * radius * sideCurve,
    radius,
    0
  );

  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  if (guide) {
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(-radius, 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(radius * tailCurve - radius, 0, radius / 50, 0, 2 * Math.PI);
    ctx.stroke();
  }

  ctx.restore();
}
