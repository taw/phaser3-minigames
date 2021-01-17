class StarEmitter {
  constructor(scene) {
    this.particles = scene.add.particles('star')
    this.emitter = this.particles.createEmitter({
      gravityY: -50,
      on: false,
      lifespan: 2000,
      speedX: {min: -50, max: 50},
      speedY: {min: -50, max: 50},
      alpha: 0.2,
      rotate: {min: -1000, max: 1000},
    })
  }

  burst_at(x, y) {
    this.emitter.emitParticle(40, x, y)
  }
}

class Brick {
  constructor(scene, x, y) {
    let colors_by_row = {
      2: 0xFF0000,
      3: 0xFF0080,
      4: 0xFF00FF,
      5: 0xFF80FF,
      6: 0x8080FF,
      7: 0x80FFFF,
    }
    this.destroyed = false
    this.brick_x_size = size_x/18
    this.brick_y_size = size_y/30
    this.brick = scene.add.graphics()
    this.brick.x = x*size_x/12
    this.brick.y = y*size_y/20
    this.brick.fillStyle(colors_by_row[y])
    this.brick.fillRect(
      -this.brick_x_size/2, -this.brick_y_size/2,
      this.brick_x_size, this.brick_y_size
    )
  }

  destroy() {
    this.brick.destroy()
    this.destroyed = true
  }

  get x() {
    return this.brick.x
  }

  get y() {
    return this.brick.y
  }
}

class Ball {
  constructor(scene) {
    this.ball = scene.add.graphics()
    this.ball.x = 0.5*size_x
    this.ball.y = 0.8*size_y
    this.ball.fillStyle(0x000000)
    this.ball.fillRect(-10,-10,20,20)
    this.dx = 300
    this.dy = -300
  }

  update(dt) {
    this.ball.x += this.dx*dt
    this.ball.y += this.dy*dt
    if (this.ball.x <= 10 && this.dx < 0) {
      this.dx = - this.dx
    }
    if (this.ball.x >= size_x-10 && this.dx > 0) {
      this.dx = - this.dx
    }
    if (this.ball.y <= 10 && this.dy < 0) {
      this.dy = - this.dy
    }
  }

  get x() {
    return this.ball.x
  }

  get y() {
    return this.ball.y
  }
}

class Paddle {
  constructor(scene) {
    this.paddle = scene.add.graphics()
    this.paddle.x = 0.5*size_x
    this.paddle.y = size_y-20
    this.paddle.fillStyle(0x0000FF)
    this.paddle.fillRect(-50, -10, 100, 20)
  }

  update(dt, direction) {
    this.paddle.x += dt * direction * 500
    this.paddle.x = Phaser.Math.Clamp(this.paddle.x, 55, size_x-55)
  }

  get x() {
    return this.paddle.x
  }
}

class MainScene extends Phaser.Scene {
  preload() {
    this.load.image("star", "../images/star3.png")
    this.load.audio("coin", "../audio/coin4.mp3")
  }

  create() {
    this.active = true
    this.paddle = new Paddle(this)
    this.ball = new Ball(this)
    this.bricks = []
    for (let x=1; x<=11; x++) {
      for (let y=2; y<=7; y++) {
        this.bricks.push(new Brick(this, x, y))
      }
    }
    this.emitter = new StarEmitter(this)
    this.coin = this.sound.add("coin")
    this.coin.volume = 0.2
  }

  handle_brick_colission(brick) {
    if (brick.destroyed) { return }
    let distance_x = Math.abs((brick.x - this.ball.x) / (10 + brick.brick_x_size/2))
    let distance_y = Math.abs((brick.y - this.ball.y) / (10 + brick.brick_y_size/2))
    if (distance_x <= 1.0 && distance_y <= 1.0) {
      brick.destroy()
      this.emitter.burst_at(this.ball.x, this.ball.y)
      this.coin.play()
      if (distance_x < distance_y) {
        this.ball_bounce_y = true
      } else {
        this.ball_bounce_x = true
      }
    }
  }

  is_game_won() {
    return this.bricks.every(b => b.destroyed)
  }

  update(_, dts) {
    if (!this.active) { return }
    let dt = dts / 1000.0
    this.ball.update(dt)
    if (this.input.keyboard.addKey("RIGHT").isDown) {
      this.paddle.update(dt, 1)
    } else if (this.input.keyboard.addKey("LEFT").isDown) {
      this.paddle.update(dt, -1)
    }
    this.ball_bounce_x = false
    this.ball_bounce_y = false
    for (let brick of this.bricks) {
      this.handle_brick_colission(brick)
    }
    if (this.ball_bounce_x) {
      this.ball.dx = -this.ball.dx
    }
    if (this.ball_bounce_y) {
      this.ball.dy = -this.ball.dy
    }
    let paddle_distance = Math.abs(this.paddle.x - this.ball.x)
    let bottom_distance = size_y - this.ball.y
    if (this.ball.dy > 0) {
      if (bottom_distance <= 30 && paddle_distance <= 60) {
        // relaunches the ball
        this.ball.dy = -300
        this.ball.dx = 7 * (this.ball.x - this.paddle.x)
      } else if (bottom_distance <= 10 && paddle_distance >= 60) {
        this.cameras.main.setBackgroundColor("#FAA")
        this.active = false
      }
    }
    if (this.is_game_won()) {
      this.cameras.main.setBackgroundColor("#FFF")
      this.active = false
    }
  }
}

let size_x = window.innerWidth
let size_y = window.innerHeight
let game = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: "#AAF",
  width: size_x,
  height: size_y,
  scene: MainScene,
})
