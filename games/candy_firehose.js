class MainScene extends Phaser.Scene {
  preload() {
    this.load.image("sweet-1", "../images/lollipop.png")
    this.load.image("sweet-2", "../images/icecream.png")
    this.load.image("sweet-3", "../images/icelolly.png")
    this.load.image("sweet-4", "../images/cupcake.png")
    this.load.image("sweet-5", "../images/doughnut.png")
  }

  create() {
    // doesn't seem like it's possible to have one emitter with multiple images (unless they're parte of a sprite sheet)
    // this means they're awkwardly controlled, and different types are on different layers, not intermixed, which looks worse
    this.particles = ["sweet-1", "sweet-2", "sweet-3", "sweet-4", "sweet-5"].map(x => this.add.particles(x))
    this.emitter = this.particles.map(x => x.createEmitter({
        gravityY: 50,
        lifespan: 10000,
        speedX: {min: 200, max: 500},
        speedY: {min: -100, max: -300},
        y: {min: 0.25*size_y, max: 0.75*size_y},
        x: 0,
        frequency: 100,
        rotate: {min: -1000, max: 1000},
    }))
  }
}

let size_x = window.innerWidth
let size_y = window.innerHeight
let game = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: "#8FB",
  width: size_x,
  height: size_y,
  scene: MainScene,
});
