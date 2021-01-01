class Character {
  constructor(scene) {
    this.graphics = scene.add.text(0, 0, "", {})
    this.move_to_random()
    this.reset()
  }

  move_to_random() {
    this.graphics.y = Phaser.Math.Between(0, size_y)
  }

  move_to_top() {
    this.graphics.y = -24*5
  }

  // When we reset, we place it on top
  reset() {
    this.graphics.x = Phaser.Math.Between(0, size_x)
    // Between 4s to 10s to fall all the way
    this.speed = Phaser.Math.Between(size_y/10, size_y/4)
    this.graphics.text = this.random_text()
    this.graphics.setFontSize(this.random_size())
    this.graphics.setFill(this.random_color())
    this.graphics.setStroke(
      this.random_outline_color(),
      Phaser.Math.Between(0, 3)
    )
  }

  update(dt) {
    this.graphics.y += this.speed*dt
    if (this.graphics.y >= size_y) {
      this.move_to_top()
      this.reset()
    }
  }

  random_text() {
    let size = Phaser.Math.Between(1, 6)
    return Array.from({length: size}).map(() => String.fromCodePoint( Phaser.Math.Between(0x30A0, 0x30FF) )).join("\n")
  }

  random_size() {
    return Phaser.Math.Between(16, 24)
  }

  random_color() {
    let r = Phaser.Math.Between(90, 140)
    let g = Phaser.Math.Between(140, 255)
    let b = Phaser.Math.Between(90, 140)
    return `rgb(${r},${g},${b})`
  }

  random_outline_color() {
    let r = Phaser.Math.Between(140, 255)
    let g = Phaser.Math.Between(90, 140)
    let b = Phaser.Math.Between(90, 140)
    return `rgb(${r},${g},${b})`
  }
}

class MainScene extends Phaser.Scene {
  create() {
    this.characters = [];
    for(let i=0; i<250; i++) {
      this.characters.push(new Character(this))
    }
  }

  update(time, dts) {
    let dt = dts / 1000;
    for (let c of this.characters) {
      c.update(dt)
    }
  }
}

let size_x = window.innerWidth;
let size_y = window.innerHeight;
let game = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: '#002200',
  width: size_x,
  height: size_y,
  scene: MainScene,
});
