class SpaceShip {
  constructor(scene) {
    this.x = size_x / 2
    this.y = size_y / 2
    this.angle = 0
    this.dx = 0
    this.dy = 0
    this.graphics = scene.add.polygon(
      this.x,
      this.y, [
        0,   -20,
        15,   10,
        15,   20,
        -15,  20,
        -15,  10,
      ],
      0x00FF00
    )
    this.graphics.setOrigin(0,0)
  }

  ensure_bounds() {
    if (this.x < 20 && this.dx < 0) {
      this.dx = -this.dx
    }
    if (this.x > size_x-20 && this.dx > 0) {
      this.dx = -this.dx
    }
    if (this.y < 20 && this.dy < 0) {
      this.dy = -this.dy
    }
    if (this.y > size_y-20 && this.dy > 0) {
      this.dy = -this.dy
    }
  }

  update(dt) {
    this.x += this.dx * dt
    this.y += this.dy * dt
    this.graphics.x = this.x
    this.graphics.y = this.y
    this.graphics.angle = this.angle
    this.ensure_bounds()
  }

  get dir_x() {
    return Math.sin(Phaser.Math.DegToRad(this.angle))
  }

  get dir_y() {
    return -Math.cos(Phaser.Math.DegToRad(this.angle))
  }

  limit_speed() {
    let dl = (this.dx*this.dx + this.dy*this.dy) ** 0.5
    let max_speed = 400.0
    if (dl > max_speed) {
      this.dx *= (max_speed/dl)
      this.dy *= (max_speed/dl)
    }
  }

  speed_up(dir, dt) {
    let speed_gain_per_second = 500.0
    this.dx += this.dir_x * dt * speed_gain_per_second * dir
    this.dy += this.dir_y * dt * speed_gain_per_second * dir
    this.limit_speed()
  }

  turn(dir, dt) {
    let degrees_per_second = 400.0
    this.angle += dir * dt * degrees_per_second
  }
}

class Star {
  constructor(scene) {
    this.graphics = scene.add.sprite(this.x, this.y, "star")
  }

  launch(x,y) {
    this.x  = x
    this.y  = y
    let angle = Phaser.Math.Between(0,360)
    let speed = Phaser.Math.Between(50, 200)
    this.dx = Math.cos(Phaser.Math.DegToRad(angle)) * speed
    this.dy = Math.sin(Phaser.Math.DegToRad(angle)) * speed
  }

  update(dt) {
    this.x += this.dx * dt
    this.y += this.dy * dt
    this.graphics.x = this.x
    this.graphics.y = this.y
    this.graphics.angle += 100*dt
    this.ensure_bounds()
  }

  ensure_bounds() {
    if (this.x < 20 && this.dx < 0) {
      this.dx = -this.dx
    }
    if (this.x > size_x-20 && this.dx > 0) {
      this.dx = -this.dx
    }
    if (this.y < 20 && this.dy < 0) {
      this.dy = -this.dy
    }
    if (this.y > size_y-20 && this.dy > 0) {
      this.dy = -this.dy
    }
  }
}

class MainScene extends Phaser.Scene {
  preload() {
    this.load.image("star", "../images/star.png")
    this.load.audio("coin", "../audio/coin4.mp3")
  }

  create() {
    this.score = 0
    this.score_text = this.add.text(10, 10, "", { fontSize: '16px', fill: '#000', align: "center" })
    this.space_ship = new SpaceShip(this)
    this.coin = this.sound.add("coin")
    this.stars = Array.from({length:25}).map(_ => {
      let s = new Star(this)
      this.relocate_star(s)
      return s
    })
  }

  relocate_star(star) {
    while (true) {
      let x = Phaser.Math.Between(100, size_x-100)
      let y = Phaser.Math.Between(100, size_y-100)
      // Make sure it's not too close to the spaceship
      if ((x-this.space_ship.x)**2 + (y-this.space_ship.x)**2 > 200**2) {
        star.launch(x,y)
        return
      }
    }
  }

  update(_, dts) {
    let dt = dts / 1000.0
    if (this.input.keyboard.addKey("UP").isDown) {
      this.space_ship.speed_up(1.0, dt)
    }
    if (this.input.keyboard.addKey("DOWN").isDown) {
      this.space_ship.speed_up(-1.0, dt)
    }
    if (this.input.keyboard.addKey("LEFT").isDown) {
      this.space_ship.turn(-1.0, dt)
    }
    if (this.input.keyboard.addKey("RIGHT").isDown) {
      this.space_ship.turn(1.0, dt)
    }
    this.score_text.text = `Stars Collected: ${this.score}`
    this.space_ship.update(dt)
    for (let star of this.stars) {
      star.update(dt)
      if (this.is_collision(this.space_ship, star)) {
        this.score += 1
        this.coin.play()
        this.relocate_star(star)
      }
    }
  }

  is_collision(a, b) {
    let dx = a.x - b.x
    let dy = a.y - b.y
    return Math.sqrt((dx*dx) + (dy*dy)) < 25
  }
}

let size_x = window.innerWidth
let size_y = window.innerHeight
let game = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: "#448",
  width: size_x,
  height: size_y,
  scene: MainScene,
})
