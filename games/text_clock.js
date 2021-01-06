// JS lacks proper standard library
function create_array(count, f) {
  let result = [];
  for (let i=0; i<count; i++) {
    result.push(f(i))
  }
  return result;
}

function each_with_index(ary, f) {
  for (let i=0; i<ary.length; i++) {
    f(ary[i], i)
  }
}

class MainScene extends Phaser.Scene {
  create_label(i) {
    let text = this.add.text(0, 0, `${i}`, { font: "10px Arial", fill: "#ff0044", align: "center" })
    text.setOrigin(0.5)
    return text
  }

  create() {
    this.last_time = null
    this.hours   = create_array(24, (i) => this.create_label(i))
    this.minutes = create_array(60, (i) => this.create_label(i))
    this.seconds = create_array(60, (i) => this.create_label(i))
    this.screen_size = Math.min(size_x, size_y)

    this.small_size = Math.max(10, 0.02 * this.screen_size)
    this.big_size = Math.max(15, 0.04 * this.screen_size)
  }

  update_label(label, distance, angle_ratio) {
    let angle_deg = 360 * angle_ratio
    let a = Phaser.Math.DegToRad(angle_deg)
    label.x = size_x / 2 + distance * Math.sin(a)
    label.y = size_y / 2 - distance * Math.cos(a)
    label.angle = angle_deg
    if (a == 0) {
      label.setColor("#44ff00")
      label.setFontSize(this.big_size)
    } else {
      label.setColor("#ff0044")
      label.setFontSize(this.small_size)
    }
  }

  update() {
    let time = new Date()
    if (this.last_time && +time == +this.last_time) return;
    this.last_time = time
    let s = time.getSeconds()
    let m = time.getMinutes()
    let h = time.getHours()

    each_with_index(this.seconds, (label,i) => {
      this.update_label(label, 0.40*this.screen_size, (i - s)/60.0)
    })

    each_with_index(this.minutes, (label,i) => {
      this.update_label(label, 0.30*this.screen_size, (i - m)/60.0)
    })

    each_with_index(this.hours, (label,i) => {
      this.update_label(label, 0.20*this.screen_size, (i - h)/24.0)
    })
  }
}

let size_x = window.innerWidth
let size_y = window.innerHeight
let game = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: "#226",
  width: size_x,
  height: size_y,
  scene: MainScene,
});
