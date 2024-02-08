let size = 16

let currentCells = Array(size)
  .fill(null)
  .map(() => Array(size).fill(0))

let count = Array(size)
  .fill(null)
  .map(() => Array(size).fill(0))

let rules = Array(2)
  .fill(null)
  .map(() => Array(9).fill(0))

function changeGridSize(newSize) {
  let factor = newSize / size
  xStart *= factor
  xEnd *= factor
  yStart *= factor
  yEnd *= factor

  recalculateConversionFactors()

  if (size < newSize) {
    //increase size of existing rows
    currentCells = currentCells.map((row) => [
      ...row,
      ...Array(newSize - size).fill(0),
    ])
    //increase number of rows and fill new rows with empty arrays
    currentCells = [
      ...currentCells,
      ...Array(newSize - size)
        .fill(null)
        .map(() => Array(newSize).fill(0)),
    ]
  } else {
    //remove excess rows
    currentCells = currentCells.slice(0, newSize)
    //remove excess columns
    currentCells = currentCells.map((row) => row.slice(0, newSize))
  }

  count = Array(newSize)
    .fill(null)
    .map(() => Array(newSize).fill(0))

  size = newSize
  redraw()
}

function createCheckboxes(state) {
  var element = document.getElementById("checkboxes" + state)
  let div
  let label
  let checkbox
  for (let i = 0; i < 9; i++) {
    div = document.createElement("div")
    label = document.createElement("label")
    label.className = "vertical"
    label.innerHTML = i
    checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.id = state + "box" + i
    checkbox.addEventListener("click", (e) => {
      rules[state][i] = e.target.checked ? 1 : 0
      e.target.blur()
    })
    label.appendChild(checkbox)
    div.appendChild(label)
    element.appendChild(div)
  }
}

createCheckboxes(0)
createCheckboxes(1)

var gridSizeSelector = document.getElementById("grid-size")
gridSizeSelector.addEventListener("change", (e) => {
  changeGridSize(parseInt(e.target.value))
  e.target.blur()
})

let option
for (let i = 4; i < 8; i++) {
  option = document.createElement("option")
  option.value = Math.pow(2, i)
  option.innerHTML = Math.pow(2, i)
  gridSizeSelector.appendChild(option)
}

var button = document.getElementById("scroll-right")
button.addEventListener("click", (e) => {
  scroll(1, 0)
  e.target.blur()
})

var button = document.getElementById("scroll-left")
button.addEventListener("click", (e) => {
  scroll(-1, 0)
  e.target.blur()
})

var button = document.getElementById("scroll-up")
button.addEventListener("click", (e) => {
  scroll(0, -1)
  e.target.blur()
})

var button = document.getElementById("scroll-down")
button.addEventListener("click", (e) => {
  scroll(0, 1)
  e.target.blur()
})

var button = document.getElementById("zoom-in")
button.addEventListener("click", (e) => {
  zoom(0.9)
  e.target.blur()
})

var button = document.getElementById("zoom-out")
button.addEventListener("click", (e) => {
  zoom(1.1)
  e.target.blur()
})

function mod(a, b) {
  let r = a % b
  return r >= 0 ? r : b + r
}

async function updateCells() {
  let nextCells = Array(size)
    .fill(null)
    .map(() => Array(size).fill(0))
  resetCount()

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      for (let x_offset = -1; x_offset <= 1; x_offset++) {
        for (let y_offset = -1; y_offset <= 1; y_offset++) {
          count[i][j] +=
            currentCells[mod(i + x_offset, size)][mod(j + y_offset, size)]
        }
      }

      nextCells[i][j] =
        rules[currentCells[i][j]][count[i][j] - currentCells[i][j]]
    }
  }
  currentCells = nextCells
  redraw()
}

function resetCount() {
  for (let i = 0; i < size; i++) for (let j = 0; j < size; j++) count[i][j] = 0
}

function scroll(x, y) {
  xEnd += x
  xStart += x

  yEnd += y
  yStart += y

  adjustBounds()
  recalculateConversionFactors()
  redraw()
}

function zoom(factor) {
  let xCenter = (xStart + xEnd) / 2
  let yCenter = (yStart + yEnd) / 2
  let width = (xEnd - xStart) / 2
  let height = (yEnd - yStart) / 2

  width *= factor
  height *= factor

  xStart = xCenter - width
  xEnd = xCenter + width

  yStart = yCenter - height
  yEnd = yCenter + height

  adjustBounds()
  recalculateConversionFactors()
  redraw()
}

function adjustBounds() {
  xStart = Math.floor(xStart)
  xEnd = Math.floor(xEnd)
  yStart = Math.floor(yStart)
  yEnd = Math.floor(yEnd)

  if (xEnd <= xStart + 1) xEnd++
  if (yEnd <= yStart + 1) yEnd++

  if (xEnd > size) {
    xStart -= xEnd - size
    xEnd = size
  }

  if (xStart < 0) {
    xEnd -= xStart
    xStart = 0
  }

  if (xEnd > size) {
    xStart = 0
    xEnd = size
  }

  if (yEnd > size) {
    yStart -= yEnd - size
    yEnd = size
  }

  if (yStart < 0) {
    yEnd -= yStart
    yStart = 0
  }

  if (yEnd > size) {
    yStart = 0
    yEnd = size
  }
}

function recalculateConversionFactors() {
  x_slope = WIDTH / (xEnd - xStart)
  x_intercept = -x_slope * xStart
  y_slope = HEIGHT / (yEnd - yStart)
  y_intercept = -y_slope * yStart
}
