import {
  BALL_COLOR,
  BALL_COLORS,
  BallPositionType,
  FieldType,
} from './StoreDataTypes'

export const generateEmptyField = (height: number, width: number) => {
  return [...Array(height)].map(() =>
    [...Array(width)].map(() => BALL_COLOR.EMPTY)
  )
}

const generateRandomNumber = (min: number = 0, max: number = 1) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const insertBalls = (field: FieldType, count: number) => {
  let MAX_RETRIES = 100
  for (let i = 0; i < count && MAX_RETRIES !== 0; i++) {
    const row = generateRandomNumber(0, field.length - 1)
    const col = generateRandomNumber(0, field[0].length - 1)
    if (field[row][col] !== BALL_COLOR.EMPTY) {
      i--
      MAX_RETRIES--
      continue
    }
    field[row][col] =
      BALL_COLORS[generateRandomNumber(0, BALL_COLORS.length - 1)]
  }

  if (MAX_RETRIES === 0) {
    for (let i = 0; i < field.length; i++) {
      for (let j = 0; j < field[0].length; j++) {
        if (field[i][j] === BALL_COLOR.EMPTY) {
          field[i][j] =
            BALL_COLORS[generateRandomNumber(0, BALL_COLORS.length - 1)]
        }
      }
    }
  }

  return field
}

const getPositionOfClosestCells = (
  field: FieldType,
  row: number,
  col: number
) => {
  const potentialPos: [number, number][] = [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ]
  const isPosOutOfRow = (x: number) => x < 0 || x > field.length - 1
  const isPosOutOfCol = (y: number) => y < 0 || y > field[0].length - 1
  return potentialPos
    .filter((pos) => !isPosOutOfRow(pos[0]))
    .filter((pos) => !isPosOutOfCol(pos[1]))
}

type CheckIfBallCanBeMovedArgsType = {
  field: FieldType
  startPos: [number, number]
  endPos: [number, number]
}

export const isBallCanBeMoved = ({
  field,
  startPos,
  endPos,
}: CheckIfBallCanBeMovedArgsType) => {
  // должны получить в стеке start
  const list = [endPos]
  const checked = new Set()
  while (list.length > 0) {
    const [row, col] = list.shift()!
    if (checked.has(`${row}_${col}`)) continue
    checked.add(`${row}_${col}`)
    if (field[row][col] !== BALL_COLOR.EMPTY) continue
    list.push(...getPositionOfClosestCells(field, row, col))
  }

  return checked.has(`${startPos[0]}_${startPos[1]}`)
}

export const findWinLines = (field: FieldType) => {
  const possibleHorizontalLines: BallPositionType[][] = []
  const possibleVerticalLines: BallPositionType[][] = []
  let currentColor = BALL_COLOR.EMPTY
  let possibleLine: BallPositionType[] = [{ row: -1, col: -1 }]

  // find horizontal lines
  for (let i = 0; i < field.length; i++) {
    currentColor = field[i][0]
    possibleLine = [{ row: i, col: 0 }]

    for (let j = 1; j < field[0].length; j++) {
      if (field[i][j] !== BALL_COLOR.EMPTY && field[i][j] === currentColor) {
        possibleLine.push({ row: i, col: j })
      } else {
        possibleHorizontalLines.push(possibleLine)
        currentColor = field[i][j]
        possibleLine = [{ row: i, col: j }]
      }
    }
    possibleHorizontalLines.push(possibleLine)
    possibleLine = []
  }

  // find vertical lines
  for (let i = 0; i < field[0].length; i++) {
    currentColor = field[0][i]
    possibleLine = [{ row: 0, col: i }]

    for (let j = 1; j < field.length; j++) {
      if (field[j][i] !== BALL_COLOR.EMPTY && field[j][i] === currentColor) {
        possibleLine.push({ row: j, col: i })
      } else {
        possibleVerticalLines.push(possibleLine)
        currentColor = field[j][i]
        possibleLine = [{ row: j, col: i }]
      }
    }
    possibleVerticalLines.push(possibleLine)
    possibleLine = []
  }

  return {
    horizontalWinLines: possibleHorizontalLines.filter(
      (line) => line.length > 4
    ),
    verticalWinLines: possibleVerticalLines.filter((line) => line.length > 4),
  }
}

export const evaluateScorePointsByLines = (winLines: BallPositionType[][]) => {
  return winLines
    .map((line) => {
      let score = 0
      for (let i = 5; i <= line.length; i++) {
        score += i
      }
      return score
    })
    .reduce((acc, sum) => acc + sum, 0)
}
