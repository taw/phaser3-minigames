let shuffle = function(a) {
  var i, j, t
  i = a.length
  while (--i > 0) {
    j = ~~(Math.random() * (i + 1))
    t = a[j]
    a[j] = a[i]
    a[i] = t
  }
  return a
}

class Tile {
  constructor(scene, x, y, c, cb) {
    this.x = x
    this.y = y
    this.c = c
    this.status = "hidden"
    this.bg = scene.add.polygon(this.x-48, this.y-48, [0, 0, 0, 96, 96, 96, 96, 0, 0, 0], 0xFF8888)
    this.bg.setStrokeStyle(2, 0x000000)
    this.bg.setOrigin(0,0)
    this.bg.setInteractive().on("pointerdown", cb)
    this.tile = scene.add.sprite(this.x, this.y, "cat" + c)
    this.tile.setDisplaySize(96, 96)
    this.tile.visible = false
    this.hidden_tile = scene.add.text(this.x-4, this.y-12, "?", {
      fontSize: "32px",
      fill: "#000"
    })
  }

  set_status(status) {
    this.status = status
    switch (status) {
      case "hidden":
        this.tile.visible = false
        this.hidden_tile.visible = true
        break
      case "peek":
      case "revealed":
        this.tile.visible = true
        this.hidden_tile.visible = false
        break
    }
  }
}

class Board {
  constructor(scene, size_x, size_y) {
    this.size_x = size_x
    this.size_y = size_y

    let cats = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]).slice(0, this.size_x * this.size_y / 2)
    let tiles = shuffle([...cats, ...cats])
    this.content = []
    for (let x=0; x<size_x; x++) {
      this.content.push([])
      for (let y=0; y<size_y; y++) {
        this.content[x].push(tiles.pop())
      }
    }
    this.setup_grid(scene)
    this.status = "ready"
  }

  setup_grid(scene) {
    this.grid = []
    for (let x=0; x<this.size_x; x++) {
      this.grid.push([])
      for (let y=0; y<this.size_y; y++) {
        let loc_x = size_x / 2 + 96 * (x - this.size_x / 2)
        let loc_y = size_y / 2 + 96 * (y - this.size_y / 2)
        this.grid[x].push(new Tile(scene, loc_x, loc_y, this.content[x][y], () => {
          scene.click(x, y)
        }))
      }
    }
  }

  click_cell(x, y) {
    if (this.grid[x][y].status === "revealed") {
      return null
    }
    switch (this.status) {
      case "ready":
        this.grid[x][y].set_status("peek")
        this.x1 = x
        this.y1 = y
        this.status = "one"
        break
      case "one":
        if (x === this.x1 && y === this.y1) {
          return null
        } else if (this.grid[x][y].c === this.grid[this.x1][this.y1].c) {
          this.grid[this.x1][this.y1].set_status("revealed")
          this.grid[x][y].set_status("revealed")
          this.status = "ready"
          return "match"
        } else {
          this.grid[x][y].set_status("peek")
          this.x2 = x
          this.y2 = y
          this.status = "two"
          return "miss"
        }
        break
      case "two":
        this.grid[this.x1][this.y1].set_status("hidden")
        this.grid[this.x2][this.y2].set_status("hidden")
        this.status = "ready"
        this.click_cell(x, y)
        break
    }
  }
}

class GameScene extends Phaser.Scene {
  init([x,y]) {
    this.x = x
    this.y = y
  }

  create() {
    this.score = 0
    this.scoreText = this.add.text(16, 16, "", {
      fontSize: "32px",
      fill: "#fff"
    })
    this.meow = this.sound.add("meow")
    this.button_menu = this.add.image(16+50, 64+20, "menu")
    this.button_menu.setInteractive().on("pointerdown", () => {
      this.scene.start("menu")
    })
    this.board = new Board(this, this.x, this.y)
    this.cameras.main.setBackgroundColor("#88F")
  }

  click(x, y) {
    switch (this.board.click_cell(x, y)) {
      case "match":
        this.meow.play()
        this.score += 1
        break
      case "miss":
        this.score += 1
        break
    }
  }

  update() {
    this.scoreText.text = `Clicks: ${this.score}`
  }
}

class MenuScene extends Phaser.Scene {
  preload() {
    var i, k
    for (i = 1; i <= 20; i++) {
      this.load.image(`cat${i}`, `../images/cat_images/cat${i}.png`)
    }
    this.load.audio("meow", "../audio/cat_meow.mp3")
    this.load.image("menu", "../images/buttons/menu.png")
    this.load.image("button2x2", "../images/buttons/play2x2.png")
    this.load.image("button4x4", "../images/buttons/play4x4.png")
    this.load.image("button6x6", "../images/buttons/play6x6.png")
  }

  create() {
    this.button22 = this.add.image(size_x * 0.5, size_y * 0.33, "button2x2")
    this.button44 = this.add.image(size_x * 0.5, size_y * 0.50, "button4x4")
    this.button66 = this.add.image(size_x * 0.5, size_y * 0.67, "button6x6")
    this.button22.setInteractive().on("pointerdown", () => {
      this.scene.start("2x2")
    })
    this.button44.setInteractive().on("pointerdown", () => {
      this.scene.start("4x4")
    })
    this.button66.setInteractive().on("pointerdown", () => {
      this.scene.start("6x6")
    })
  }
}

let size_x = window.innerWidth
let size_y = window.innerHeight
let game = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: "#f8f",
  width: size_x,
  height: size_y,
})
game.scene.add("menu", MenuScene, true)
game.scene.add("2x2", GameScene, false, [2, 2])
game.scene.add("4x4", GameScene, false, [4, 4])
game.scene.add("6x6", GameScene, false, [6, 6])
