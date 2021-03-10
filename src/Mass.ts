import { Vector2d } from "./Vector2d";

export class Mass {
  private readonly mass: number;

  protected readonly radius: number;
  protected position: Vector2d;
  protected velocity: Vector2d;
  protected rotationSpeed: number;

  angle: number;

  protected static calculateRadius(mass: number, density = 1) {
    return Math.sqrt(mass / density / Math.PI);
  }

  constructor(
    x: number,
    y: number,
    mass?: number,
    radius?: number,
    angle?: number,
    velocity?: Vector2d,
    rotationSpeed?: number
  ) {
    this.position = new Vector2d(x, y);
    this.mass = mass ?? 1;
    this.radius = radius ?? 50;
    this.angle = angle ?? 0;
    this.velocity = velocity ?? new Vector2d(0, 0);
    this.rotationSpeed = rotationSpeed ?? 0;
  }

  update(elapsed: number, ctx: CanvasRenderingContext2D) {
    this.position.x += this.velocity.x * elapsed;
    this.position.y += this.velocity.y * elapsed;
    this.angle += this.rotationSpeed * elapsed;
    this.angle %= 2 * Math.PI;

    if (this.position.x - this.radius > ctx.canvas.width) {
      this.position.x = -this.radius;
    }

    if (this.position.x + this.radius < 0) {
      this.position.x = ctx.canvas.width + this.radius;
    }

    if (this.position.y - this.radius > ctx.canvas.height) {
      this.position.y = -this.radius;
    }

    if (this.position.y + this.radius < 0) {
      this.position.y = ctx.canvas.height + this.radius;
    }
  }

  push(angle: number, force: number, elapsed: number) {
    this.velocity.x += (elapsed * (Math.cos(angle) * force)) / this.mass;
    this.velocity.y += (elapsed * (Math.sin(angle) * force)) / this.mass;
  }

  twist(force: number, elapsed: number) {
    this.rotationSpeed += (elapsed * force) / this.mass;
  }

  get velocityValue() {
    return Math.sqrt(
      Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2)
    );
  }

  get movementAngle() {
    return Math.atan2(this.velocity.y, this.velocity.x);
  }

  get radiusValue() {
    return this.radius;
  }

  get massValue() {
    return this.mass;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.lineTo(0, 0);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.restore();
  }
}
