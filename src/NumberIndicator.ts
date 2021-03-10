import { Vector2d } from "./Vector2d";

type NumberIndicatorOptions = {
  digits?: number;
  pt?: number;
  align?: CanvasTextAlign;
};

export class NumberIndicator {
  private readonly label: string;
  private position: Vector2d;
  private readonly digits: number;
  private readonly pt: number;
  private readonly align: CanvasTextAlign;

  constructor(
    label: string,
    x: number,
    y: number,
    options?: NumberIndicatorOptions
  ) {
    this.label = `${label}: `;
    this.position = new Vector2d(x, y);
    this.digits = options?.digits ?? 0;
    this.pt = options?.pt ?? 10;
    this.align = options?.align ?? "end";
  }

  draw(ctx: CanvasRenderingContext2D, value: number) {
    ctx.save();

    ctx.fillStyle = "white";
    ctx.font = `${this.pt}pt sans-serif`;
    ctx.textAlign = this.align;

    ctx.fillText(
      `${this.label}${value.toFixed(this.digits)}`,
      this.position.x,
      this.position.y + this.pt + 1
    );

    ctx.restore();
  }
}
