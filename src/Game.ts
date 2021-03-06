import "./global.css";

import { Grid } from "./Grid";
import { Asteroid } from "./Asteroid";
import { Ship } from "./Ship";
import { Projectile } from "./Projectile";
import { Mass } from "./Mass";
import { isColliding } from "./util";
import { Indicator } from "./Indicator";
import { NumberIndicator } from "./NumberIndicator";
import { Message } from "./Message";
import { DisappearingMessage } from "./DisappearingMessage";

class Game {
  private canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;

  private guide?: boolean = false;

  private asteroids: Asteroid[];
  private ship: Ship;
  private projectiles: Projectile[] = [];
  private readonly healthIndicator: Indicator;
  private readonly scoreIndicator: NumberIndicator;
  private readonly fpsIndicator: NumberIndicator;
  private readonly message: Message;
  private levelIndicator: NumberIndicator;
  private levelupMessage: DisappearingMessage;

  private previous: number = 0;
  private elapsed: number = 0;
  private readonly asteroidPushForce: number = 5000000;
  private readonly asteroidMass = 10000;
  private readonly massDestroyed = 500;
  private score = 0;

  private fps = 0;
  private gameOver = false;
  private level = 1;

  constructor(canvas: HTMLElement | null, guide?: boolean) {
    console.info("[[Initializing Asteroids game]]");

    if (!canvas) {
      throw new Error("Canvas element is not provided");
    }

    this.canvas = canvas as HTMLCanvasElement;
    const ctx = this.canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Getting CanvasRenderingContext2d failed");
    }

    this.ctx = ctx;
    this.ctx.canvas.focus();

    this.guide = guide;

    this.ctx.lineWidth = 0.5;
    this.ctx.strokeStyle = "white";
    this.ctx.fillStyle = "#bada55";

    this.healthIndicator = new Indicator("HP", 5, 5, 100, 10);
    this.scoreIndicator = new NumberIndicator("Score", this.w - 10, 5);
    this.fpsIndicator = new NumberIndicator("FPS", this.w - 10, this.h - 15, {
      digits: 2,
    });
    this.message = new Message(this.w / 2, this.h * 0.45);
    this.levelIndicator = new NumberIndicator("Level", this.w / 2, 5, {
      align: "center",
    });
    this.levelupMessage = new DisappearingMessage(
      this.w / 2,
      this.h / 2,
      undefined,
      { align: "center" }
    );

    this.ctx.canvas.addEventListener("keydown", (event) => {
      this.keyboardHandler(event, true);
    });

    this.ctx.canvas.addEventListener("keyup", (event) => {
      this.keyboardHandler(event, false);
    });

    this.asteroids = [];
    this.asteroids.push(this.createMovingAsteroid());

    this.ship = new Ship(this.w / 2, this.h / 2, 1000, 400);
  }

  private resetGame() {
    this.ship = new Ship(this.w / 2, this.h / 2, 1000, 400);
    this.asteroids = [];
    this.projectiles = [];
    this.score = 0;
    this.gameOver = false;
    this.level = 0;
    this.levelUp();
  }

  private get w() {
    return this.ctx.canvas.width;
  }

  private get h() {
    return this.ctx.canvas.height;
  }

  private frame = (timestamp: DOMHighResTimeStamp) => {
    if (!this.previous) {
      this.previous = timestamp;
    }

    this.elapsed = timestamp - this.previous;
    this.fps = 1000 / this.elapsed;

    this.update(this.elapsed / 1000.0);
    this.draw();

    this.previous = timestamp;
    window.requestAnimationFrame(this.frame);
  };

  private draw = () => {
    this.ctx.clearRect(0, 0, this.w, this.h);

    if (this.guide) {
      Grid.draw(this.ctx);

      this.asteroids.forEach((asteroid) => {
        this.drawGuideLine(asteroid, this.ship);
      });
    }

    for (const asteroid of this.asteroids) {
      asteroid.draw(this.ctx, this.guide);
    }

    this.projectiles.forEach((projectile) => {
      projectile.draw(this.ctx);
    });

    if (this.gameOver) {
      this.message.draw(
        this.ctx,
        "GAME OVER",
        `Final score: ${this.score.toFixed()}`,
        "Press space to play again"
      );
      return;
    }

    this.ship.draw(this.ctx, this.guide);

    this.healthIndicator.draw(
      this.ctx,
      this.ship.healthValue,
      this.ship.maxHealthValue
    );
    this.scoreIndicator.draw(this.ctx, this.score);
    this.levelIndicator.draw(this.ctx, this.level);
    this.levelupMessage.draw(this.ctx, `Level ${this.level}`);

    if (this.guide) {
      this.fpsIndicator.draw(this.ctx, this.fps);
    }
  };

  private update = (elapsed: number) => {
    if (this.asteroids.length === 0) {
      this.levelUp();
    }

    this.ship.isCompromised = false;

    this.asteroids.forEach((asteroid) => {
      asteroid.update(elapsed, this.ctx);
      if (isColliding(asteroid, this.ship)) {
        this.ship.isCompromised = true;
      }
    });

    this.projectiles.forEach((projectile) => {
      projectile.update(elapsed, this.ctx);
      if (!projectile.isDead) {
        this.asteroids.forEach((asteroid) => {
          if (isColliding(asteroid, projectile)) {
            projectile.die();
            asteroid.destroy();
            this.splitAsteroid(asteroid, elapsed);
          }
        });
      }
    });

    this.projectiles = this.projectiles.filter((p) => !p.isDead);
    this.asteroids = this.asteroids.filter((a) => !a.isDamaged);

    this.levelupMessage.update(elapsed);

    if (this.ship.healthValue <= 0) {
      this.gameOver = true;
      return;
    }

    this.ship.update(elapsed, this.ctx);

    if (this.ship.isFired && this.ship.isLoaded) {
      this.projectiles.push(this.ship.emitProjectile(elapsed));
    }
  };

  private keyboardHandler(event: KeyboardEvent, isPressed: boolean) {
    let nothingHandled = false;

    switch (event.code) {
      case "ArrowUp":
        this.ship.thrusterOn = isPressed;
        break;
      case "ArrowRight":
        this.ship.rightThrusterOn = isPressed;
        break;
      case "ArrowLeft":
        this.ship.leftThrusterOn = isPressed;
        break;
      case "Space":
        if (this.gameOver) {
          this.resetGame();
        } else {
          this.ship.isFired = isPressed;
        }
        break;
      case "KeyG":
        if (isPressed) {
          this.guide = !this.guide;
        }
        break;
      default:
        nothingHandled = true;
    }

    if (!nothingHandled) {
      event.preventDefault();
    }
  }

  private createMovingAsteroid(elapsed?: number) {
    const asteroid = this.createAsteroid();
    this.pushAsteroid(asteroid, elapsed);

    return asteroid;
  }

  private createAsteroid() {
    return new Asteroid(
      this.w * Math.random(),
      this.h * Math.random(),
      this.asteroidMass
    );
  }

  private pushAsteroid(asteroid: Asteroid, elapsed: number = 0.015) {
    asteroid.push(2 * Math.PI * Math.random(), this.asteroidPushForce, elapsed);
    asteroid.twist(
      (Math.random() - 0.5) * Math.PI * this.asteroidPushForce * 0.02,
      elapsed
    );
  }

  private drawGuideLine(firstObject: Mass, secondObject: Mass) {
    this.ctx.save();
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 0.5;

    this.ctx.beginPath();
    this.ctx.moveTo(firstObject.x, firstObject.y);
    this.ctx.lineTo(secondObject.x, secondObject.y);
    this.ctx.stroke();

    this.ctx.restore();
  }

  private splitAsteroid(asteroid: Asteroid, elapsed: number) {
    const newMass = asteroid.massValue - this.massDestroyed;
    this.score += this.massDestroyed;

    const split = 0.25 + 0.5 * Math.random();
    const newAsteroidFirst = asteroid.makeChild(newMass * split);
    const newAsteroidSecond = asteroid.makeChild(newMass * (1.0 - split));

    [newAsteroidFirst, newAsteroidSecond].forEach((childAsteroid) => {
      if (childAsteroid.massValue < this.massDestroyed) {
        this.score += childAsteroid.massValue;
      } else {
        this.pushAsteroid(childAsteroid, elapsed);
        this.asteroids.push(childAsteroid);
      }
    });
  }

  private levelUp() {
    this.level += 1;
    this.levelupMessage.reset();

    for (let i = 0; i < this.level; i++) {
      this.asteroids.push(this.createMovingAsteroid());
    }
  }

  public run = () => {
    console.info("[[Running Asteroids game]]");
    window.requestAnimationFrame(this.frame);
  };
}

const game = new Game(document.getElementById("asteroids"));
game.run();
