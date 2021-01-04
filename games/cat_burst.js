class CatEmitter {
  constructor(scene) {
    this.particles = scene.add.particles('cat')
    this.emitter = this.particles.createEmitter({
      gravityY: 200,
      on: false,
      lifespan: 5000,
      speedX: {min: -100, max: 100},
      speedY: {min: -100, max: 100},
      rotate: {min: -1000, max: 1000},
    })
  }

  burst_at(x, y) {
    this.emitter.emitParticle(5, x, y)
 }
}

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

class MainScene extends Phaser.Scene {
  preload() {
    this.load.image("star", "../images/star2.png")
    this.load.image("cat", "../images/cat-cupid-love-icon2.png")
    this.load.audio("coin", "../audio/coin4.mp3")
  }

  create() {
    this.star_emitter = new StarEmitter(this)
    this.cat_emitter = new CatEmitter(this)
    this.coin = this.sound.add("coin")
    this.input.on("pointerdown", (pointer) => {
      let {x,y} = pointer;
      this.star_emitter.burst_at(x, y)
      this.cat_emitter.burst_at(x, y)
      this.coin.play()
      this.coin.volume = 0.2
    })
  }
}

let size_x = window.innerWidth
let size_y = window.innerHeight
let game = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: "#8fa",
  width: size_x,
  height: size_y,
  scene: MainScene,
});
