import { Message, MessageOptions } from "./Message";

export class DisappearingMessage extends Message {
  private readonly lifeTime: number;
  private life: number = 1.0;

  constructor(
    x: number,
    y: number,
    lifeTime?: number,
    options?: MessageOptions
  ) {
    super(x, y, options);
    this.lifeTime = lifeTime ?? 1.0;
  }

  draw(ctx: CanvasRenderingContext2D, main: string) {
    if (this.life > 0) {
      ctx.save();

      ctx.fillStyle = this.fillStyle;
      ctx.textAlign = this.textAlign;
      ctx.globalAlpha = this.life;

      ctx.font = `${this.mainPt}pt sans-serif`;
      ctx.fillText(
        main,
        this.position.x,
        this.position.y - 35 * (1 - this.life)
      );

      ctx.restore();
    }
  }

  update(elapsed: number) {
    if (this.life > 0) {
      this.life -= elapsed / this.lifeTime;
    }
  }

  reset() {
    this.life = 1.0;
  }
}
