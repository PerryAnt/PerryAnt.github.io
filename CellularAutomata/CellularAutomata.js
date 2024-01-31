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

rules[0][3] = 1
rules[1][2] = 1
rules[1][3] = 1

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
