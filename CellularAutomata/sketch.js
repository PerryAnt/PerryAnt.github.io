// canvas size
let WIDTH = 800
let HEIGHT = 800

// visible cells
let xStart = 0
let xEnd = 10
let yStart = 0
let yEnd = 10

// used in formulas for converting between cell indices and canvas coordinates
let x_slope = WIDTH / (xEnd - xStart)
let x_intercept = -x_slope * xStart
let y_slope = HEIGHT / (yEnd - yStart)
let y_intercept = -y_slope * yStart

function setup() {
  var canvas = createCanvas(WIDTH, HEIGHT)
  canvas.parent("sketch-holder")
}

function draw() {
  const xSize = WIDTH / (xEnd - xStart)
  const ySize = HEIGHT / (yEnd - yStart)
  background(0)

  stroke(128)
  for (let i = 1; i < xEnd - xStart; i++) {
    line(i * xSize, 0, i * xSize, HEIGHT)
  }

  for (let j = 1; j < yEnd - yStart; j++) {
    line(0, j * ySize, WIDTH, j * ySize)
  }

  fill(255)
  for (let i = xStart; i < xEnd; i++) {
    for (let j = yStart; j < yEnd; j++) {
      if (currentCells[i][j]) {
        const [x, y] = indexToCoordinates(i, j)
        rect(x, y, xSize, ySize)
      }
    }
  }
  noLoop()
}

function indexToCoordinates(i, j) {
  const x = i * x_slope + x_intercept
  const y = j * y_slope + y_intercept
  return [x, y]
}

function coordinatesToIndex(x, y) {
  const i = Math.floor((x - x_intercept) / x_slope)
  const j = Math.floor((y - y_intercept) / y_slope)

  return [i, j]
}

function mouseClicked() {
  const [i, j] = coordinatesToIndex(mouseX, mouseY)
  if (i >= 0 && i < size && j >= 0 && j < size) {
    currentCells[i][j] = 1 - currentCells[i][j]
    redraw()
  }
}

function keyPressed() {
  if (key == " ") {
    updateCells()
  }
}
