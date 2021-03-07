import "./global.css";

import { Grid } from "./Grid";
import { Asteroid } from "./Asteroid";
import { Ship } from "./Ship";

class Game {
  private canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;

  private readonly guide?: boolean = false;

  private readonly asteroids: Asteroid[];
  private ship: Ship;

  private previous: number = 0;
  private elapsed: number = 0;

  constructor(canvas: HTMLElement | null, guide?: boolean) {
    console.log("[[Initializing Asteroids game]]");

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

    this.ctx.lineWidth = 0.5;
    this.ctx.strokeStyle = "white";
    this.ctx.fillStyle = "#bada55";

    this.asteroids = [];
    for (let i = 0; i < 4; i++) {
      const asteroid = new Asteroid(
        Math.random() * this.ctx.canvas.width,
        Math.random() * this.ctx.canvas.height,
        2000 + Math.random() * 8000
      );
      asteroid.push(Math.random() * 2 * Math.PI, 2000, 60);
      asteroid.twist((Math.random() - 0.5) * 500, 60);

      this.asteroids.push(asteroid);
    }

    this.ship = new Ship(
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2,
      1000,
      { guide: true }
    );

    this.ctx.canvas.addEventListener("keydown", (event) => {
      this.keyboardHandler(event, true);
    });

    this.ctx.canvas.addEventListener("keyup", (event) => {
      this.keyboardHandler(event, false);
    });

    this.ctx.canvas.focus();
  }

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
      Grid.draw(this.ctx);
    }

    for (const asteroid of this.asteroids) {
      asteroid.draw(this.ctx, this.guide);
    }

    this.ship.draw(this.ctx);
  };

  private update = (elapsed: number) => {
    for (let asteroid of this.asteroids) {
      asteroid.update(elapsed, this.ctx);
    }

    this.ship.update(elapsed, this.ctx);
  };

  private keyboardHandler(event: KeyboardEvent, isThrusterOn: boolean) {
    let nothingHandled = false;

    switch (event.code) {
      case "ArrowUp":
        this.ship.thrusterOn = isThrusterOn;
        break;
      case "ArrowRight":
        this.ship.rightThrusterOn = isThrusterOn;
        break;
      case "ArrowLeft":
        this.ship.leftThrusterOn = isThrusterOn;
        break;
      default:
        nothingHandled = true;
    }

    if (!nothingHandled) {
      event.preventDefault();
    }
  }

  public run = () => {
    console.info("[[Running Asteroids game]]");
    window.requestAnimationFrame(this.frame);
  };
}

const game = new Game(document.getElementById("asteroids"), true);
// @ts-ignore
window.game = game;
game.run();
