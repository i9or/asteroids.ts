import "../css/global.css";

import { drawGrid } from "./draw-grid";
import { Asteroid } from "./Asteroid";
import { drawShip } from "./draw-ship";

class Game {
  private canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;

  private readonly guide?: boolean = false;

  private asteroids: Asteroid[] = [];

  private previous: number = 0;
  private elapsed: number = 0;

  constructor(canvas: HTMLElement | null, guide?: boolean) {
    if (!canvas) {
      throw new Error("Canvas element is not provided");
    }

    this.canvas = canvas as HTMLCanvasElement;
    const ctx = this.canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Getting CanvasRenderingContext2d failed");
    }

    this.ctx = ctx;
    this.guide = guide;
  }

  private initGame = () => {
    this.ctx.lineWidth = 0.5;
    this.ctx.strokeStyle = "white";
    this.ctx.fillStyle = "#bada55";

    this.asteroids = [
      new Asteroid(24, 34, this.w, this.h, { noise: 0.5 }),
      new Asteroid(24, 43, this.w, this.h, { noise: 0.5 }),
      new Asteroid(12, 29, this.w, this.h, { noise: 0.3 }),
      new Asteroid(5, 12, this.w, this.h, { noise: 0.7 }),
    ];
  };

  private get w() {
    return this.ctx.canvas.width;
  }

  private get h() {
    return this.ctx.canvas.height;
  }

  private frame = (timestamp: DOMHighResTimeStamp) => {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    if (!this.previous) {
      this.previous = timestamp;
    }

    this.elapsed = timestamp - this.previous;

    this.update(this.elapsed / 1000.0);
    this.draw();

    this.previous = timestamp;
    window.requestAnimationFrame(this.frame);
  };

  private draw = () => {
    if (this.guide) {
      drawGrid(this.ctx);
    }

    for (const asteroid of this.asteroids) {
      asteroid.draw(this.ctx, this.guide);
    }

    this.ctx.save();
    this.ctx.translate(100, 200);
    drawShip(this.ctx, 10, this.guide);
    this.ctx.restore();
  };

  private update = (elapsed: number) => {
    for (let asteroid of this.asteroids) {
      asteroid.update(this.ctx, elapsed);
    }
  };

  public run = () => {
    console.log("[[Initializing Asteroids game]]");
    this.initGame();
    console.info("[[Running Asteroids game]]");
    window.requestAnimationFrame(this.frame);
  };
}

const game = new Game(document.getElementById("asteroids"), true);
game.run();
