class SpaceShip {
  constructor(scene) {
    this.x = size_x / 2
    this.y = size_y / 2
    this.angle = 0
    this.dx = 0
    this.dy = 0
    this.graphics = scene.add.polygon(
      this.x,
      this.y,
      [
        0, -20,
        15, 10,
        15, 20,
        -15, 20,
        -15, 10,
      ],
      0x00FF00
    )
    this.graphics.setOrigin(0,0)
  }

  ensure_bounds() {
    if (this.x < 20 && this.dx < 0) {
      this.dx = -this.dx
    }
    if (this.x > size_x - 20 && this.dx > 0) {
      this.dx = -this.dx
    }
    if (this.y < 20 && this.dy < 0) {
      this.dy = -this.dy
    }
    if (this.y > size_y - 20 && this.dy > 0) {
      this.dy = -this.dy
    }
  }

  get dir_x() {
    return Math.sin(Phaser.Math.DegToRad(this.angle))
  }

  get dir_y() {
    return -Math.cos(Phaser.Math.DegToRad(this.angle))
  }

  limit_speed() {
    let dl = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
    let max_speed = 250.0
    if (dl > max_speed) {
      this.dx *= max_speed / dl
      this.dy *= max_speed / dl
    }
  }

  speed_up(dir, dt) {
    var speed_gain_per_second
    speed_gain_per_second = 400.0
    this.dx += this.dir_x * dt * speed_gain_per_second * dir
    this.dy += this.dir_y * dt * speed_gain_per_second * dir
    this.limit_speed()
  }

  turn(dir, dt) {
    let degrees_per_second = 400.0
    this.angle += dir * dt * degrees_per_second
  }


  update(dt) {
    this.x += this.dx * dt
    this.y += this.dy * dt
    this.graphics.x = this.x
    this.graphics.y = this.y
    this.graphics.angle = this.angle
    this.ensure_bounds()
  }
}

class Asteroid {
  constructor(scene, x, y) {
    this.x = x
    this.y = y
    let angle = Phaser.Math.Between(0, 360)
    let speed = Phaser.Math.Between(50, 200)
    this.dx = Math.cos(Phaser.Math.DegToRad(angle)) * speed
    this.dy = Math.sin(Phaser.Math.DegToRad(angle)) * speed
    this.graphics = scene.add.graphics(this.x, this.y)
    this.graphics.fillStyle(0xFF0000)
    this.graphics.fillCircle(0, 0, 20)
  }

  update(dt) {
    this.x += this.dx * dt
    this.y += this.dy * dt
    this.graphics.x = this.x
    this.graphics.y = this.y
    this.ensure_bounds()
  }

  ensure_bounds() {
    if (this.x < 20 && this.dx < 0) {
      this.dx = -this.dx
    }
    if (this.x > size_x - 20 && this.dx > 0) {
      this.dx = -this.dx
    }
    if (this.y < 20 && this.dy < 0) {
      this.dy = -this.dy
    }
    if (this.y > size_y - 20 && this.dy > 0) {
      this.dy = -this.dy
    }
  }
}

class MainScene extends Phaser.Scene {
  create() {
    this.score = 0
    this.scoreText = this.add.text(10, 10, "", {
      fontSize: '16px',
      fill: '#000',
      align: "center"
    })
    this.active = true
    this.space_ship = new SpaceShip(this)
    this.asteroids = [];
    for(let i=0; i<100; i++) {
      // avoid center
      let x = Phaser.Math.Between(100, size_x - 100)
      let y = Phaser.Math.Between(100, size_y - 100)
      if (Math.abs(x - size_x / 2) + Math.abs(y - size_y / 2) > 600) {
        this.asteroids.push(new Asteroid(this, x, y))
      }
      if (this.asteroids.length == 20) {
        break
      }
    }
  }

  collision(a, b) {
    return Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y) < 25
  }

  update(_, dts) {
    let dt = dts/1000.0
    if (!this.active) {
      return
    }
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
    this.score += dt
    this.scoreText.text = `You survived ${ this.score.toFixed(3) }s`
    this.space_ship.update(dt)
    for (let asteroid of this.asteroids) {
      asteroid.update(dt)
      if (this.collision(this.space_ship, asteroid)) {
        this.active = false
      }
    }
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
