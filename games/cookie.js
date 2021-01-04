class MainScene extends Phaser.Scene {
  preload() {
    this.load.image("cookie", "../images/cookie.png")
    this.load.image("banana", "../images/banana.png")
    this.load.audio("coin", "../audio/balsa.mp3")
  }

  create() {
    this.score = 0
    this.scoreText = this.add.text(16, 16, "", { fontSize: "32px", fill: "#fff" })

    this.cookie_shadow = this.add.sprite(0, 0, "cookie")
    this.cookie_shadow.tint = 0x000000
    this.cookie_shadow.alpha = 0.2

    let bananas = this.add.particles('banana')

    this.coin = this.sound.add("coin")

    this.cookie = this.add.sprite(
      Phaser.Math.Between(60, size_x-60),
      Phaser.Math.Between(60, size_y-60),
      "cookie",
    )

    this.cookie.setInteractive();
    this.cookie.on('pointerdown', () => {
      this.score += 1
      this.emitter.emitParticle(10, this.cookie.x, this.cookie.y)
      this.coin.play()
    })

    let angle = Phaser.Math.DegToRad(Phaser.Math.Between(0, 360))
    let speed = 200.0
    this.dx = Math.cos(angle) * speed
    this.dy = Math.sin(angle) * speed

    // doesn't seem like there's any way to make them spin
    this.emitter = bananas.createEmitter({
      x: 0,
      y: 0,
      on: false,
      lifespan: 100_000,
      speed: { min: -500, max: 500 },
      gravityY: 200,
      gravityX: 0,
      alpha: {min: 0.5, max: 0.8},
      rotate: {min: -1000, max: 1000},
    });

    this.emitter.emitParticle(10, this.cookie.x, this.cookie.y)
  }

  update(time, dts) {
    let dt = dts / 1000.0
    if (this.cookie.x < 60 || this.cookie.x >= size_x - 60) {
      this.dx = -this.dx
    }
    if (this.cookie.y < 60 || this.cookie.y >= size_y - 60) {
      this.dy = -this.dy
    }

    this.cookie.x += this.dx * dt
    this.cookie.y += this.dy * dt

    this.scoreText.text = `Score: ${this.score}`

    let dl = (this.dx**2 + this.dy**2) ** 0.5

    this.cookie_shadow.x = this.cookie.x - 10 * this.dx/dl
    this.cookie_shadow.y = this.cookie.y - 10 * this.dy/dl
  }
}

let size_x = window.innerWidth;
let size_y = window.innerHeight;
let game = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: '#4993FA',
  width: size_x,
  height: size_y,
  scene: MainScene,
});
