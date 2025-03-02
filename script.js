class SnakeGame {
  constructor(canvasId, spriteSrc) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 400;
    this.canvas.height = 400;
    this.snake = [{ x: 200, y: 200 }];
    this.food = this.getRandomFoodPosition();
    this.direction = "RIGHT";
    this.directionChangedOnTick = false;
    this.sprite = new Image();
    this.sprite.src = spriteSrc;
    document.addEventListener("keydown", this.changeDirection.bind(this));
    this.sprite.onload = () => this.gameLoop();
  }

  getRandomFoodPosition() {
    let foodPosition;

    do {
      foodPosition = {
        x: Math.floor(Math.random() * (this.canvas.width / 20)) * 20,
        y: Math.floor(Math.random() * (this.canvas.height / 20)) * 20,
      };
    } while (this.snake.some(({ x, y }) => x === foodPosition.x && y === foodPosition.y));

    return foodPosition;
  }

  changeDirection(event) {
    if (this.directionChangedOnTick) return;

    const key = event.key;
    if ((key === "ArrowUp" || key === "w") && this.direction !== "DOWN") this.direction = "UP";
    else if ((key === "ArrowDown" || key === "s") && this.direction !== "UP") this.direction = "DOWN";
    else if ((key === "ArrowLeft" || key === "a") && this.direction !== "RIGHT") this.direction = "LEFT";
    else if ((key === "ArrowRight" || key === "d") && this.direction !== "LEFT") this.direction = "RIGHT";

    this.directionChangedOnTick = true;
  }

  gameLoop() {
    this.update();
    this.draw();
    this.directionChangedOnTick = false;
    if (this.snake.length === 400) {
      alert("You win!");
      document.location.reload();
    } else if (this.checkCollision()) {
      alert("Game Over!");
      document.location.reload();
    } else {
      setTimeout(this.gameLoop.bind(this), 100);
    }
  }

  update() {
    let head = { ...this.snake[0] };
    if (this.direction === "UP") head.y -= 20;
    if (this.direction === "DOWN") head.y += 20;
    if (this.direction === "LEFT") head.x -= 20;
    if (this.direction === "RIGHT") head.x += 20;

    if (head.x === this.food.x && head.y === this.food.y) {
      this.food = this.getRandomFoodPosition();
    } else {
      this.snake.pop();
    }

    this.snake.unshift(head);
  }

  draw() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.drawImage(this.sprite, 0, 192, 64, 64, this.food.x, this.food.y, 20, 20);

    this.snake.forEach((segment, index, array) => {
      let spriteX = 64;
      let spriteY = 0;

      if (index === 0) {
        // graphic for head
        switch (this.direction) {
          case "UP":
            spriteX = 192;
            spriteY = 0;
            break;
          case "DOWN":
            spriteX = 256;
            spriteY = 64;
            break;
          case "LEFT":
            spriteX = 192;
            spriteY = 64;
            break;
          case "RIGHT":
            spriteX = 256;
            spriteY = 0;
        }
      } else {
        let prev = array[index - 1];
        let next = array[index + 1];

        // graphic for the tail
        if (index === array.length - 1) {
          if (prev.x < segment.x) {
            spriteX = 192;
            spriteY = 192;
          } else if (prev.x > segment.x) {
            spriteX = 256;
            spriteY = 128;
          } else if (prev.y < segment.y) {
            spriteX = 192;
            spriteY = 128;
          } else if (prev.y > segment.y) {
            spriteX = 256;
            spriteY = 192;
          }
        } else if (
          // generowania srodka weza skierowanego pionowo
          (prev.x === segment.x && segment.x === next.x && prev.y < segment.y && segment.y < next.y) ||
          (prev.x === segment.x && segment.x === next.x && prev.y > segment.y && segment.y > next.y)
        ) {
          spriteX = 128;
          spriteY = 64;
        } else if (
          // generowania srodka weza skierowanego poziomo
          (prev.x < segment.x && segment.x < next.x && prev.y === segment.y && segment.y === next.y) ||
          (prev.x > segment.x && segment.x > next.x && prev.y === segment.y && segment.y === next.y)
        ) {
          spriteX = 64;
          spriteY = 0;
        } else if (
          // skret
          (prev.x < segment.x && next.y < segment.y) ||
          (next.x < segment.x && prev.y < segment.y)
        ) {
          spriteX = 128;
          spriteY = 128;
        } else if (
          // skret
          (prev.x > segment.x && next.y < segment.y) ||
          (next.x > segment.x && prev.y < segment.y)
        ) {
          spriteX = 0;
          spriteY = 64;
        } else if (
          // skret
          (prev.x < segment.x && next.y > segment.y) ||
          (next.x < segment.x && prev.y > segment.y)
        ) {
          spriteX = 128;
          spriteY = 0;
        } else if (
          // skret
          (prev.x > segment.x && next.y > segment.y) ||
          (next.x > segment.x && prev.y > segment.y)
        ) {
          spriteX = 0;
          spriteY = 0;
        }
      }

      this.ctx.drawImage(this.sprite, spriteX, spriteY, 64, 64, segment.x, segment.y, 20, 20);
    });
  }

  checkCollision() {
    const head = this.snake[0];
    if (head.x < 0 || head.y < 0 || head.x >= this.canvas.width || head.y >= this.canvas.height) {
      return true;
    }
    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        return true;
      }
    }
    return false;
  }
}

new SnakeGame("gameCanvas", "image.png");
