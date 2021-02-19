export function drawGrid(
  ctx: CanvasRenderingContext2D,
  minor: number = 10,
  major: number = 50,
  stroke: string = "#00ff00",
  fill: string = "#009900"
) {
  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fill;

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  for (let x = 0; x < width; x += minor) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, width);
    ctx.lineWidth = x % major === 0 ? 0.5 : 0.25;
    ctx.stroke();

    if (x % major === 0) {
      ctx.fillText(x.toString(), x + 3, 10);
    }
  }

  for (let y = 0; y < height; y += minor) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(height, y);
    ctx.lineWidth = y % major === 0 ? 0.5 : 0.25;
    ctx.stroke();

    if (y % major === 0) {
      ctx.fillText(y.toString(), 3, y + 10);
    }
  }

  ctx.restore();
}
