import { Vector2d, Vec2 } from "./Vec2";

type DrawAsteroidOptions = {
  stroke?: string;
  fill?: string;
  noise?: number;
};

export class Asteroid {
  private segments: number;
  private readonly shape: Array<number>;
  private readonly radius: number;
  private readonly noise: number = 0;
  private readonly stroke: string = "white";
  private readonly fill: string = "black";
  private position: Vector2d;
  private velocity: Vector2d;
  private angle: number;
  private readonly rotationSpeed: number;

  constructor(
    segments: number,
    radius: number,
    canvasW: number,
    canvasH: number,
    drawOptions: DrawAsteroidOptions
  ) {
    this.position = new Vec2(canvasH * Math.random(), canvasW * Math.random());
    this.angle = 0;
    this.velocity = new Vec2(
      canvasW * (Math.random() - 0.5),
      canvasH * (Math.random() - 0.5)
    );
    this.rotationSpeed = 2 * Math.PI * (Math.random() - 0.5);
    this.radius = radius;
    this.shape = [];
    this.segments = segments;
    for (let i = 0; i < segments; i++) {
      this.shape.push(Math.random() - 0.5);
    }

    if (drawOptions.noise) {
      this.noise = drawOptions.noise;
    }
    if (drawOptions.stroke) {
      this.stroke = drawOptions.stroke;
    }
    if (drawOptions.fill) {
      this.fill = drawOptions.fill;
    }
  }

  private drawAsteroid(ctx: CanvasRenderingContext2D, guide: boolean): void {
    ctx.strokeStyle = this.stroke;
    ctx.fillStyle = this.fill;

    ctx.save();
    ctx.beginPath();

    for (let i = 0; i < this.shape.length; i++) {
      ctx.rotate((2 * Math.PI) / this.shape.length);
      ctx.lineTo(this.radius + this.radius * this.noise * this.shape[i], 0);
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (guide) {
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = 0.2;
      ctx.arc(0, 0, this.radius + this.radius * this.noise, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, this.radius - this.radius * this.noise, 0, 2 * Math.PI);
      ctx.stroke();
    }

    ctx.restore();
  }

  update(ctx: CanvasRenderingContext2D, elapsed: number): void {
    if (
      this.position.x - this.radius + elapsed * this.velocity.x >
      ctx.canvas.width
    ) {
      this.position.x = -this.radius;
    }

    if (this.position.x + this.radius + elapsed * this.velocity.x < 0) {
      this.position.x = ctx.canvas.width + this.radius;
    }

    if (
      this.position.y - this.radius + elapsed * this.velocity.y >
      ctx.canvas.height
    ) {
      this.position.y = -this.radius;
    }

    if (this.position.y + this.radius + elapsed * this.velocity.y < 0) {
      this.position.y = ctx.canvas.height + this.radius;
    }

    this.position.x += elapsed * this.velocity.x;
    this.position.y += elapsed * this.velocity.y;

    this.angle = (this.angle + elapsed * this.rotationSpeed) % (2 * Math.PI);
  }

  draw(ctx: CanvasRenderingContext2D, guide: boolean = false): void {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle);
    this.drawAsteroid(ctx, guide);
    ctx.restore();
  }
}
