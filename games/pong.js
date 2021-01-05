class MainScene extends Phaser.Scene {
  reset_ball() {
    this.ball.x  = size_x / 2
    this.ball.y  = size_y / 2
    this.ball_dx = 150
    this.ball_dy = 150
  }

  hit_left_paddle() {
    return Math.abs(this.left_paddle.y - this.ball.y) < 65 + 25
  }

  hit_right_paddle() {
    return Math.abs(this.right_paddle.y - this.ball.y) < 65 + 25
  }

  ensure_bounds() {
    if (this.ball.x < 65 && this.ball_dx < 0) {
      if (this.hit_left_paddle()) {
        this.ball_dx *= -1.1
        this.ball_dy *= 1.1
      } else {
        this.right_score_val += 1
        this.reset_ball()
      }
    }
    if (this.ball.x > size_x-65 && this.ball_dx > 0) {
      if (this.hit_right_paddle()) {
        this.ball_dx *= -1.1
        this.ball_dy *= 1.1
      } else {
        this.left_score_val += 1
        this.reset_ball()
      }
    }
    if (this.ball.y < 25 && this.ball_dy < 0) {
      this.ball_dy = -this.ball_dy
    }
    if (this.ball.y > size_y-25 && this.ball_dy > 0) {
      this.ball_dy = -this.ball_dy
    }
  }

  create() {
    // middle dashed vertical line
    this.grid = this.add.graphics({x: size_x / 2, y: size_y / 2})
    this.grid.lineStyle(5, 0x000000, 1)
    this.grid.beginPath()
    for(let y=-size_y / 2; y <= size_y / 2; y+=20) {
      this.grid.moveTo(0, y)
      this.grid.lineTo(0, y + 10)
    }
    this.grid.strokePath()

    // score display
    this.left_score_val  = 0
    this.right_score_val = 0

    this.left_score = this.add.text(size_x / 4, size_y / 8, this.left_score_val, { fontSize: '100px', fill: '#000', align: "center" })

    this.right_score = this.add.text(size_x / 4 * 3, size_y / 8, this.right_score_val, { fontSize: '100px', fill: '#000', align: "center" })

    // paddles
    this.left_paddle = this.add.graphics({x: 10, y: size_y / 2})
    this.left_paddle.lineStyle(0)
    this.left_paddle.fillStyle(0x000)
    this.left_paddle.fillRect(0, -65, 30, 130)

    this.right_paddle = this.add.graphics({x: size_x - 40, y: size_y / 2})
    this.right_paddle.lineStyle(0)
    this.right_paddle.fillStyle(0x000)
    this.right_paddle.fillRect(0, -65, 30, 130)

    // ball
    this.ball = this.add.graphics({x: size_x / 4, y: size_y / 4})
    this.ball.lineStyle(0)
    this.ball.fillStyle(0x000)
    this.ball.fillCircle(0, 0, 25)
    this.ball_dx = 300
    this.ball_dy = 300
  }

  update(_, dts) {
    // move paddles up/down
    let dt = dts/1000.0
    if (this.input.keyboard.addKey('W').isDown) {
      this.left_paddle.y -= dt * 600
    }
    if (this.input.keyboard.addKey('S').isDown) {
      this.left_paddle.y += dt * 600
    }

    if (this.input.keyboard.addKey('UP').isDown) {
      this.right_paddle.y -= dt * 600
    }
    if (this.input.keyboard.addKey('DOWN').isDown) {
      this.right_paddle.y += dt * 600
    }

    // ensure paddle boundaries
    this.left_paddle.y = Phaser.Math.Clamp(this.left_paddle.y, 75, size_y - 75)
    this.right_paddle.y = Phaser.Math.Clamp(this.right_paddle.y, 75, size_y - 75)

    // move ball
    this.ball.x += dt * this.ball_dx
    this.ball.y += dt * this.ball_dy

    // ball boundary check
    this.ensure_bounds()

    // udpate scores
    this.left_score.text  = this.left_score_val
    this.right_score.text = this.right_score_val
  }
}

let size_x = window.innerWidth
let size_y = window.innerHeight
let game = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: "#FFFF00",
  width: size_x,
  height: size_y,
  scene: MainScene,
});
