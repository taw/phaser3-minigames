class MainScene extends Phaser.Scene {
  preload() {
    this.load.image("cat", "../images/cat_images/cat17.png")
    this.load.image("star", "../images/star-icon.png")
    this.load.audio("meow", "../audio/cat_meow.mp3")
    this.load.audio("meow2", "../audio/cat_meow_2.mp3")
  }

  create() {
    this.grid = this.add.graphics({x: size_x / 2, y: size_y / 2})
    this.grid.lineStyle(5, "white")
    this.grid.lineStyle(5, 0x000000, 1)
    this.grid.beginPath()
    for(let y=-size_y / 2; y <= size_y / 2; y+=20) {
      this.grid.moveTo(0, y)
      this.grid.lineTo(0, y + 10)
    }
    this.grid.strokePath()

    this.left_score_val = 0
    this.left_score = this.add.text(size_x / 4, size_y / 8, this.left_score_val, {
      fontSize: "100px",
      fill: "#000",
      align: "center"
    })

    this.right_score_val = 0
    this.right_score = this.add.text(size_x / 4 * 3, size_y / 8, this.right_score_val, {
      fontSize: "100px",
      fill: "#000",
      align: "center"
    })

    this.left_paddle = this.add.graphics({x: 10, y: size_y / 2})
    this.left_paddle.lineStyle(0)
    this.left_paddle.fillStyle(0x000)
    this.left_paddle.fillRect(0, -65, 30, 130)

    this.right_paddle = this.add.graphics({x: size_x - 40, y: size_y / 2})
    this.right_paddle.lineStyle(0)
    this.right_paddle.fillStyle(0x000)
    this.right_paddle.fillRect(0, -65, 30, 130)

    this.stars = this.add.particles("star")
    this.emitter = this.stars.createEmitter({
      gravityY: 200,
      on: false,
      speedX: {min: -200, max: 200},
      speedY: {min: -200, max: 200},
      alpha: 0.4,
      lifespan: 2500,
    })

    this.ball = this.add.sprite(0, 0, "cat")
    this.ball.setDisplaySize(50,50)
    this.reset_ball()

    this.meow = this.sound.add("meow")
    this.meow2 = this.sound.add("meow2")
  }

  fail_effects() {
    this.meow2.play()
    this.reset_ball()
  }

  hit_left_paddle() {
    return Math.abs(this.left_paddle.y - this.ball.y) < 65 + 25
  }

  hit_right_paddle() {
    return Math.abs(this.right_paddle.y - this.ball.y) < 65 + 25
  }

  bounce_left_paddle() {
    let intercept = (this.left_paddle.y - this.ball.y) / (65 + 25)
    let speed = 1.1 * Math.sqrt(this.ball_dx * this.ball_dx + this.ball_dy * this.ball_dy)
    this.launch_ball(speed, 0 - 45 * intercept)
    this.bounce_effects()
  }

  bounce_right_paddle() {
    let intercept = (this.right_paddle.y - this.ball.y) / (65 + 25)
    let speed = 1.1 * Math.sqrt(this.ball_dx * this.ball_dx + this.ball_dy * this.ball_dy)
    this.launch_ball(speed, 180 + 45 * intercept)
    this.bounce_effects()
  }

  launch_ball(speed, angle) {
    this.ball_dx = Math.cos(Phaser.Math.DegToRad(angle)) * speed
    this.ball_dy = Math.sin(Phaser.Math.DegToRad(angle)) * speed
  }

  bounce_effects() {
    this.emitter.emitParticle(40, this.ball.x, this.ball.y)
    this.meow.play()
  }

  reset_ball() {
    var angle
    this.ball.x = size_x / 2
    this.ball.y = size_y / 2
    if (Phaser.Math.Between(0, 1) === 0) {
      angle = Phaser.Math.Between(-45, 45)
    } else {
      angle = Phaser.Math.Between(180 - 45, 180 + 45)
    }
    let start_speed = Math.max(400.0, size_x / 4)
    this.launch_ball(start_speed, angle)
  }

  ensure_bounds() {
    if (this.ball.x < 65 && this.ball_dx < 0) {
      if (this.hit_left_paddle()) {
        this.bounce_left_paddle()
      } else {
        this.right_score_val += 1
        this.fail_effects()
      }
    }
    if (this.ball.x > size_x - 65 && this.ball_dx > 0) {
      if (this.hit_right_paddle()) {
        this.bounce_right_paddle()
      } else {
        this.left_score_val += 1
        this.fail_effects()
      }
    }
    if (this.ball.y < 25 && this.ball_dy < 0) {
      this.ball_dy = -this.ball_dy
    }
    if (this.ball.y > size_y - 25 && this.ball_dy > 0) {
      this.ball_dy = -this.ball_dy
    }
  }

  update(_, dts) {
    let dt = dts / 1000.0
    let paddle_speed = Math.max(600.0, size_y / 2)
    if (this.input.keyboard.addKey("W").isDown) {
      this.left_paddle.y -= dt * paddle_speed
    }
    if (this.input.keyboard.addKey("S").isDown) {
      this.left_paddle.y += dt * paddle_speed
    }
    if (this.input.keyboard.addKey("UP").isDown) {
      this.right_paddle.y -= dt * paddle_speed
    }
    if (this.input.keyboard.addKey("DOWN").isDown) {
      this.right_paddle.y += dt * paddle_speed
    }
    this.left_paddle.y = Phaser.Math.Clamp(this.left_paddle.y, 75, size_y - 75)
    this.right_paddle.y = Phaser.Math.Clamp(this.right_paddle.y, 75, size_y - 75)
    this.ball.x += dt * this.ball_dx
    this.ball.y += dt * this.ball_dy
    this.ensure_bounds()
    this.left_score.text = this.left_score_val
    this.right_score.text = this.right_score_val
  }
}

let size_x = window.innerWidth
let size_y = window.innerHeight
let game = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: "#AAFFAA",
  width: size_x,
  height: size_y,
  scene: MainScene,
});
