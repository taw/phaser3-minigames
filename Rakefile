require "pathname"

class CreateNewGame
  def initialize(title, file_name)
    @title = title
    @file_name = file_name
  end

  def js_path
    Pathname("games/#{@file_name}.js")
  end

  def html_path
    Pathname("games/#{@file_name}.html")
  end

  def index_path
    Pathname("index.html")
  end

  def index_line
    %Q[    <li><a href="games/#{@file_name}.html">#{@title}</a></li>\n]
  end

  def add_line_to_index!
    index_path.read
    index_path.write( index_path.read.sub(%r[( *</ul>)]) { index_line + $1 } )
  end

  def create_js_file!
    return if js_path.exist?
    js_path.write(
'class MainScene extends Phaser.Scene {
  preload() {
  }

  create() {
  }

  update() {
  }
}

let size_x = window.innerWidth
let size_y = window.innerHeight
let game = new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: "#f88",
  width: size_x,
  height: size_y,
  scene: MainScene,
})
')
  end

  def create_html_file!
    return if html_path.exist?
    html_path.write(
%Q[<!DOCTYPE html>
<html>
<head>
  <title>#{@title}</title>
  <link rel="stylesheet" href="./reset.css">
  <script src="./phaser-arcade-physics.min.js"></script>
  <script src="./#{@file_name}.js"></script>
  <style>
    body{
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>
<body>
</body>
</html>
])
  end

  def call
    create_js_file!
    create_html_file!
    add_line_to_index!
  end
end


desc "Run http server"
task "httpd" do
  system "ruby -run -e httpd . -p 9090"
end

desc "Create skeleton for a new game"
task "game", [:name] do |t, args|
  title = args[:name]
  file_name = title.downcase.tr(" ", "_")
  puts "Creating game '#{title}' with file name '#{file_name}'"
  CreateNewGame.new(title, file_name).call
end
