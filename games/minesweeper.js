class Cell {
  constructor(scene, x, y, c) {
    this.x = x
    this.y = y
    this.c = c
    this.revealed = false
    this.flagged = false

    this.grid_hidden = scene.add.polygon(
      this.x, this.y,
      [-20, -20, -20, 20, 20, 20, 20, -20, -20, -20],
      0x888888,
    )
    this.grid_hidden.setStrokeStyle(2, 0x000000, 1)
    this.grid_hidden.setOrigin(0,0)

    this.grid_visible = scene.add.polygon(
      this.x, this.y,
      [-20, -20, -20, 20, 20, 20, 20, -20, -20, -20],
      (this.c === "X") ? 0xFFAAAA : 0xAAAAAA
    )
    this.grid_visible.setStrokeStyle(2, 0x000000, 1)
    this.grid_visible.setOrigin(0,0)
    this.grid_visible.visible = false

    let label = this.c
    let style = {
      align: "center",
      fontSize: "16px",
    }
    switch (this.c) {
      case 0:
        label = ""
        break
      case 1:
      case 5:
        style.fill = "#0000FF"
        break
      case 2:
      case 6:
        style.fill = "#00FF00"
        break
      case 3:
      case 7:
        style.fill = "#FF0000"
        break
      case 4:
      case 8:
        style.fill = "#FF00FF"
        break
      default:
        null
    }
    this.text = scene.add.text(this.x, this.y, label, style)
    this.text.visible = false
  }

  reveal() {
    this.revealed = true
    this.text.visible = true
    this.grid_hidden.visible = false
    this.grid_visible.visible = true
  }

  flip_flag() {
    this.flagged = !this.flagged
    if (this.flagged) {
      this.grid_hidden.setFillStyle(0xFFAAAA)
    } else {
      this.grid_hidden.setFillStyle(0xAAAAAA)
    }
  }
}

class Board {
  constructor(scene) {
    this.size_x = 10
    this.size_y = 10
    this.mines = 10
    this.content = []
    for (let x=0; x<this.size_x; x++) {
      this.content.push([])
      for (let y=0; y<this.size_y; y++) {
        this.content[x].push(null)
      }
    }
    this.setup_mines()
    this.setup_numbers()
    this.setup_grid(scene)
  }

  setup_mines() {
    let mines_todo = this.mines
    while (mines_todo > 0) {
      let x = Phaser.Math.Between(0, this.size_x - 1)
      let y = Phaser.Math.Between(0, this.size_y - 1)
      if (this.content[x][y] === null) {
        this.content[x][y] = "X"
        mines_todo -= 1
      }
    }
  }

  mines_near_xy(x, y) {
    let total = 0
    for (let xx of [x - 1, x, x + 1]) {
      if (xx < 0 || xx >= this.size_x) {
        continue
      }
      for (let yy of [y - 1, y, y + 1]) {
        if (yy < 0 || yy >= this.size_y) {
          continue
        }
        if (this.content[xx][yy] === "X") {
          total += 1
        }
      }
    }
    return total
  }

  setup_numbers() {
    for (let x=0; x<this.size_x; x++) {
      for (let y=0; y<this.size_y; y++) {
        if (this.content[x][y] === "X") {
          continue
        }
        this.content[x][y] = this.mines_near_xy(x, y)
      }
    }
  }

  setup_grid(scene) {
    this.grid = []
    for (let x=0; x<this.size_x; x++) {
      this.grid.push([])
      for (let y=0; y<this.size_y; y++) {
        let loc_x = (size_x / 2 - 180) + 40 * x
        let loc_y = (size_y / 2 - 180) + 40 * y
        this.grid[x].push(new Cell(scene, loc_x, loc_y, this.content[x][y]))
      }
    }
  }

  auto_propagate_reveal(x, y) {
    if (x < 0 || x >= this.size_x) {
      return
    }
    if (y < 0 || y >= this.size_y) {
      return
    }
    if (this.grid[x][y].revealed) {
      return
    }
    this.click_cell(x, y)
  }

  click_cell(x, y) {
    if (this.grid[x][y].revealed) {
      return
    }
    if (this.grid[x][y].flagged) {
      return
    }
    this.grid[x][y].reveal()
    if (this.grid[x][y].c === 0) {
      this.auto_propagate_reveal(x - 1, y - 1)
      this.auto_propagate_reveal(x - 1, y)
      this.auto_propagate_reveal(x - 1, y + 1)
      this.auto_propagate_reveal(x, y - 1)
      this.auto_propagate_reveal(x, y + 1)
      this.auto_propagate_reveal(x + 1, y - 1)
      this.auto_propagate_reveal(x + 1, y)
      this.auto_propagate_reveal(x + 1, y + 1)
    }
  }

  right_click_cell(x, y) {
    if (this.grid[x][y].revealed) {
      return
    }
    this.grid[x][y].flip_flag()
  }
}

class MainScene extends Phaser.Scene {
  preload() {
    this.load.audio("meow", "../audio/cat_meow.mp3")
  }

  create() {
    this.result = this.add.text(16, 16, '', {
      fontSize: '32px',
      fill: '#fff'
    })
    this.board = new Board(this)
    this.meow = this.sound.add("meow")

    this.input.mouse.disableContextMenu()

    this.input.on('pointerdown', (event) => {
      this.click(event.worldX, event.worldY, event.rightButtonDown())
    })
  }

  click(x, y, is_right_click) {
    x = Math.floor((x - size_x / 2 + 200) / 40)
    y = Math.floor((y - size_y / 2 + 200) / 40)
    if (x >= 0 && x <= this.board.size_x - 1 && y >= 0 && y <= this.board.size_y - 1) {
      if (is_right_click) {
        this.board.right_click_cell(x, y)
      } else {
        if (this.board.grid[x][y].flagged) {
          return
        }
        this.board.click_cell(x, y)
        if (this.board.grid[x][y].c === "X") {
          return this.meow.play()
        }
      }
    }
  }

  update() {
    this.result.text = "Have fun playing"
  }
}

let size_x = window.innerWidth
let size_y = window.innerHeight
let game = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: "#8F8",
  width: size_x,
  height: size_y,
  scene: MainScene,
})
