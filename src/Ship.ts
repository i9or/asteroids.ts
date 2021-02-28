import { Mass } from "./Mass";

type ShipOptions = {
  guide?: boolean;
  lineWidth?: number;
  stroke?: string;
  fill?: string;
  tailCurve?: number;
  sideCurve?: number;
};

export class Ship extends Mass {
  private readonly guide: boolean;
  private readonly lineWidth: number;
  private readonly stroke: string;
  private readonly fill: string;
  private readonly tailCurve: number;
  private readonly sideCurve: number;

  constructor(x: number, y: number, options?: ShipOptions) {
    super(x, y, 10, 15, 1.5 * Math.PI);
    this.guide = options?.guide ?? false;
    this.lineWidth = options?.lineWidth ?? 2;
    this.stroke = options?.stroke ?? "white";
    this.fill = options?.fill ?? "black";
    this.tailCurve = options?.tailCurve ?? 0.25;
    this.sideCurve = options?.sideCurve ?? 0.75;
  }

  private drawShip(ctx: CanvasRenderingContext2D) {
    ctx.save();

    let shipArcAngle = 0.25 * Math.PI;

    if (this.guide) {
      this.drawBottomGuide(ctx);
    }

    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.fill;

    ctx.beginPath();
    ctx.moveTo(this.radius, 0);

    ctx.quadraticCurveTo(
      Math.cos(shipArcAngle) * this.radius * this.sideCurve,
      Math.sin(shipArcAngle) * this.radius * this.sideCurve,
      Math.cos(Math.PI - shipArcAngle) * this.radius,
      Math.sin(Math.PI - shipArcAngle) * this.radius
    );

    ctx.quadraticCurveTo(
      -this.radius * this.tailCurve,
      0,
      Math.cos(Math.PI + shipArcAngle) * this.radius,
      Math.sin(Math.PI + shipArcAngle) * this.radius
    );

    ctx.quadraticCurveTo(
      Math.cos(-shipArcAngle) * this.radius * this.sideCurve,
      Math.sin(-shipArcAngle) * this.radius * this.sideCurve,
      this.radius,
      0
    );

    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    if (this.guide) {
      this.drawGuideTop(ctx);
    }

    ctx.restore();
  }

  private drawGuideTop(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(-this.radius, 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(
      this.radius * this.tailCurve - this.radius,
      0,
      this.radius / 50,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  }

  private drawBottomGuide(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle);
    this.drawShip(ctx);
    ctx.restore();
  }
}
