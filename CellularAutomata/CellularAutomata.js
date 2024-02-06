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
  xStart = 0
  xEnd = newSize
  yStart = 0
  yEnd = newSize

  x_slope = WIDTH / (xEnd - xStart)
  x_intercept = -x_slope * xStart
  y_slope = HEIGHT / (yEnd - yStart)
  y_intercept = -y_slope * yStart

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
