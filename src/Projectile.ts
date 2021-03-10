import { Mass } from "./Mass";
import { Vector2d } from "./Vector2d";

export class Projectile extends Mass {
  private readonly lifeTime: number;
  private life: number;

  constructor(
    x: number,
    y: number,
    mass: number,
    lifeTime: number,
    velocity: Vector2d,
    rotationSpeed: number
  ) {
    super(
      x,
      y,
      mass,
      Mass.calculateRadius(mass, 0.001),
      0,
      velocity,
      rotationSpeed
    );
    this.lifeTime = lifeTime;
    this.life = 1.0;
  }

  private drawProjectile(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const colorValue = `${Math.round(100 * this.life)}%`;
    ctx.fillStyle = `rgba(50%, 100%, ${colorValue}, 70%)`;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

  update(elapsed: number, ctx: CanvasRenderingContext2D) {
    this.life -= elapsed / this.lifeTime;
    super.update(elapsed, ctx);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle);
    this.drawProjectile(ctx);
    ctx.restore();
  }

  get isDead() {
    return this.life <= 0;
  }

  die() {
    this.life = 0;
  }
}
