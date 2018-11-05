const getNewBoard = (n = 15) => {
  const board = []
  for (let i = 0; i < n; i++) {
    const row = []
    for (let j = 0; j < n; j++) {
      row.push(0)
    }
    board.push(row)
  }

  return board
}


const checkFullBoard = (board) => {
  if (!board) return null
  // const directions = [`left`, `right`, `top`, `bottom`, `topLeft`, `topRight`, `bottomLeft`, `bottomRight`]
  const directions = [`right`, `bottom`, `topRight`, `bottomRight`]

  const rowSize = board.length
  const colSize = board[0].length
  const isColSizeSame = board.every((row, index, array) => row.length === array[0].length)
  if (!isColSizeSame) throw `invalid board size`

  const result = { chess: 0 }

  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      if (board[i][j] === 0) continue

      const temp = {}
      directions.forEach(direction => temp[direction] = [])

      for (let n = 0; n < 5; n++) {
        // temp.left.push((j - n >= 0) ? board[i][j - n] : null)
        temp.right.push((j + n < colSize) ? board[i][j + n] : null)
        // temp.top.push((i - n >= 0) ? board[i - n][j] : null)
        temp.bottom.push((i + n < rowSize) ? board[i + n][j] : null)

        // temp.topLeft.push((i - n >= 0 && j - n >= 0) ? board[i - n][j - n] : null)
        temp.topRight.push((i - n >= 0 && j + n < colSize) ? board[i - n][j + n] : null)
        // temp.bottomLeft.push((i + n  < rowSize && j - n >= 0) ? board[i + n][j - n] : null)
        temp.bottomRight.push((i + n  < rowSize && j + n < colSize) ? board[i + n][j + n] : null)
      }
      directions.forEach(direction => {
        const isWin = temp[direction].every((chess, index, array) => chess === array[0])
        if (isWin) {
          result.chess = board[i][j]
          result.row = i
          result.col = j
          result.direction = direction
        }
      })
    }
  }

  return result
}

export default {
  getNewBoard,
  checkFullBoard,
}
