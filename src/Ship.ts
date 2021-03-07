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
  private readonly thrusterPower: number;
  private readonly steeringPower: number;

  public thrusterOn: boolean;
  public leftThrusterOn: boolean;
  public rightThrusterOn: boolean;

  constructor(
    x: number,
    y: number,
    thrusterPower: number,
    options?: ShipOptions
  ) {
    super(x, y, 10, 15, 1.5 * Math.PI);
    this.thrusterPower = thrusterPower;
    this.steeringPower = this.thrusterPower / 20;
    this.thrusterOn = false;
    this.leftThrusterOn = false;
    this.rightThrusterOn = false;
    this.guide = options?.guide ?? false;
    this.lineWidth = options?.lineWidth ?? 2;
    this.stroke = options?.stroke ?? "white";
    this.fill = options?.fill ?? "black";
    this.tailCurve = options?.tailCurve ?? 0.25;
    this.sideCurve = options?.sideCurve ?? 0.75;
  }

  private drawShip(ctx: CanvasRenderingContext2D) {
    if (this.guide) {
      this.drawAngleAndPositionGuide(ctx);
    }

    ctx.save();

    let shipArcAngle = 0.25 * Math.PI;

    if (this.guide) {
      this.drawBottomGuide(ctx);
    }

    if (this.thrusterOn) {
      ctx.save();
      ctx.strokeStyle = "yellow";
      ctx.fillStyle = "red";
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(
        (Math.cos(Math.PI + Math.PI * 0.8) * this.radius) / 2 - 10,
        (Math.sin(Math.PI + Math.PI * 0.8) * this.radius) / 2
      );
      ctx.quadraticCurveTo(
        -this.radius * 2,
        0,
        (Math.cos(Math.PI - Math.PI * 0.8) * this.radius) / 2 - 10,
        (Math.sin(Math.PI - Math.PI * 0.8) * this.radius) / 2
      );
      ctx.fill();
      ctx.stroke();

      ctx.restore();
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

  private drawAngleAndPositionGuide(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.rotate(-this.angle);
    ctx.strokeText(
      `angle: ${Math.floor((this.angle * 180.0) / Math.PI)}`,
      20,
      this.radius
    );
    ctx.strokeText(
      `x: ${Math.floor(this.position.x)}, y: ${Math.floor(this.position.y)}`,
      20,
      this.radius + 12
    );
    ctx.strokeText(
      `velocity: ${Math.floor(this.velocityValue)}`,
      20,
      this.radius + 12 * 2
    );
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

  update(elapsed: number, ctx: CanvasRenderingContext2D) {
    if (this.thrusterOn) {
      this.push(this.angle, this.thrusterPower, elapsed);
    }

    let steeringThrusterDirection = 0;
    if (this.rightThrusterOn) {
      steeringThrusterDirection += 1;
    }
    if (this.leftThrusterOn) {
      steeringThrusterDirection -= 1;
    }
    this.twist(steeringThrusterDirection * this.steeringPower, elapsed);

    super.update(elapsed, ctx);
  }
}
