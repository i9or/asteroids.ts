import { Vector2d } from "./Vector2d";

export type MessageOptions = {
  mainPt?: number;
  subPt?: number;
  fillStyle?: string;
  align: CanvasTextAlign;
};

export class Message {
  protected position: Vector2d;
  protected readonly mainPt: number;
  private readonly subPt: number;
  protected readonly fillStyle: string;
  protected readonly textAlign: CanvasTextAlign;

  constructor(x: number, y: number, options?: MessageOptions) {
    this.position = new Vector2d(x, y);
    this.mainPt = options?.mainPt ?? 36;
    this.subPt = options?.subPt ?? 14;
    this.fillStyle = options?.fillStyle ?? "white";
    this.textAlign = options?.align ?? "center";
  }

  draw(ctx: CanvasRenderingContext2D, main: string, ...sub: string[]) {
    ctx.save();

    ctx.fillStyle = this.fillStyle;
    ctx.textAlign = this.textAlign;

    ctx.font = `${this.mainPt}pt sans-serif`;
    ctx.fillText(main, this.position.x, this.position.y);

    ctx.font = `${this.subPt}pt sans-serif`;
    sub.forEach((line, i) => {
      ctx.fillText(
        line,
        this.position.x,
        this.position.y + this.mainPt * (i + 1)
      );
    });

    ctx.restore();
  }
}
