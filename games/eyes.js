class Eye {
  constructor(scene, cell_x, cell_y) {
    let cx = cell_x * size_x / 4
    let cy = cell_y * size_y / 4
    let max_eye_size = Math.min(size_x, size_y) / 8
    this.eyesize = Phaser.Math.Between(max_eye_size*0.3, max_eye_size*0.8)
    this.x = Phaser.Math.Between(cx + 50, cx + size_x / 4 - 50)
    this.y = Phaser.Math.Between(cy + 50, cy + size_y / 4 - 50)
    this.max_eye_movement = this.eyesize * 0.2

    this.eye = scene.add.graphics({x: this.x, y: this.y})
    this.eye.fillStyle(0xFFFFFF)
    this.eye.lineStyle(3, 0x000000, 1)
    this.eye.fillCircle(0, 0, this.eyesize);
    this.eye.strokeCircle(0, 0, this.eyesize);

    this.retina = scene.add.graphics({x: this.x, y: this.y})
    this.retina.fillStyle(this.rand_retina_color())
    this.retina.fillCircle(0, 0, this.eyesize*0.5)
  }

  rand_retina_color() {
    return (
      (Phaser.Math.Between(140, 255) << 16) +
      (Phaser.Math.Between(90, 140) << 8) +
      (Phaser.Math.Between(90, 140))
    )
  }

  update(mx,my) {
    let dx = mx - this.x
    let dy = my - this.y
    let dl = Math.sqrt(dx*dx + dy*dy)
    if (dl > this.max_eye_movement) {
      dx = this.max_eye_movement * dx / dl
      dy = this.max_eye_movement * dy / dl
    }
    this.retina.x = this.x + dx
    this.retina.y = this.y + dy
  }
}

class MainScene extends Phaser.Scene {
  create() {
    this.eyes = [];

    for(let x of [0,1,2,3]) {
      for(let y of [0,1,2,3]) {
        this.eyes.push(new Eye(this, x, y))
      }
    }
  }

  update() {
    let x = this.input.activePointer.worldX
    let y = this.input.activePointer.worldY
    for(let eye of this.eyes) {
      eye.update(x,y)
    }
  }
}

let size_x = window.innerWidth;
let size_y = window.innerHeight;
let game = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: '#f88',
  width: size_x,
  height: size_y,
  scene: MainScene,
});
