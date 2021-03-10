import { Vector2d } from "./Vector2d";

export class Indicator {
  private readonly label: string;
  private readonly position: Vector2d;
  private readonly width: number;
  private readonly height: number;

  constructor(
    label: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.label = `${label}: `;
    this.position = new Vector2d(x, y);
    this.width = width;
    this.height = height;
  }

  draw(ctx: CanvasRenderingContext2D, max: number, level: number) {
    ctx.save();

    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.font = `${this.height}pt sans-serif`;
    const offset = ctx.measureText(this.label).width;

    ctx.fillText(
      this.label,
      this.position.x,
      this.position.y + this.height - 1
    );

    ctx.beginPath();
    ctx.rect(
      offset + this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(
      offset + this.position.x,
      this.position.y,
      this.width * (max / level),
      this.height
    );
    ctx.fill();

    ctx.restore();
  }
}
