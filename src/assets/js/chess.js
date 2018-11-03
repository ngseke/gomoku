export const getNewBoard = (n) => {
  const board = []
  for (let i = 0; i < n; i++) {
    const row = []
    for (let j = 0; j < n; j++) {
      row.push(0)
    }
    board.push(row)
  }

  return Object.assign({}, board)
}

export const checkBoard = (board) => {
}
