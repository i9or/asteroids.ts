import { Vector2d } from "./Vector2d";
import { Mass } from "./Mass";

type AsteroidOptions = {
  stroke?: string;
  fill?: string;
  noise?: number;
  density?: number;
};

export class Asteroid extends Mass {
  private readonly segments: number;
  private readonly shape: number[];
  private readonly noise: number;
  private readonly stroke: string;
  private readonly fill: string;
  private readonly circumference: number;
  private shot = false;

  constructor(
    x: number,
    y: number,
    mass: number,
    velocity?: Vector2d,
    rotationSpeed?: number,
    options?: AsteroidOptions
  ) {
    super(
      x,
      y,
      mass,
      Mass.calculateRadius(mass, options?.density),
      0,
      velocity,
      rotationSpeed
    );
    this.circumference = 2 * Math.PI * this.radius;
    this.segments = Math.ceil(this.circumference / 15);
    this.segments = Math.min(25, Math.max(5, this.segments));
    this.noise = options?.noise ?? 0.2;
    this.shape = [];
    for (let i = 0; i < this.segments; i++) {
      this.shape.push(2 * (Math.random() - 0.5));
    }
    this.stroke = options?.stroke ?? "white";
    this.fill = options?.fill ?? "black";
  }

  private drawAsteroid(ctx: CanvasRenderingContext2D, guide: boolean): void {
    ctx.save();
    ctx.strokeStyle = this.stroke;
    ctx.fillStyle = this.fill;

    ctx.beginPath();

    for (let i = 0; i < this.shape.length; i++) {
      ctx.rotate((2 * Math.PI) / this.shape.length);
      ctx.lineTo(this.radius + this.radius * this.noise * this.shape[i], 0);
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (guide) {
      this.drawGuide(ctx);
    }

    ctx.restore();
  }

  private drawGuide(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 0.5;

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 0.2;
    ctx.arc(0, 0, this.radius + this.radius * this.noise, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, this.radius - this.radius * this.noise, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
  }

  draw(ctx: CanvasRenderingContext2D, guide: boolean = false): void {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle);
    this.drawAsteroid(ctx, guide);
    ctx.restore();
  }

  get isDamaged() {
    return this.shot;
  }

  destroy() {
    this.shot = true;
  }

  makeChild(mass: number) {
    return new Asteroid(
      this.x,
      this.y,
      mass,
      new Vector2d(this.velocity.x, this.velocity.y),
      this.rotationSpeed
    );
  }
}
