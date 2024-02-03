const size = 10

let currentCells = Array(size)
  .fill(null)
  .map(() => Array(size).fill(0))

let count = Array(size)
  .fill(null)
  .map(() => Array(size).fill(0))

let rules = Array(2)
  .fill(null)
  .map(() => Array(9).fill(0))

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
