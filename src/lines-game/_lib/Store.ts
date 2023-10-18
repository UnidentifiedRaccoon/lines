import EventBus from './EventBus'
import { cloneDeep, exactEqual, merge, objectFromPath } from './ObjectHelpers'
import {
  evaluateScorePointsByLines,
  findWinLines,
  generateEmptyField,
  insertBalls,
  isBallCanBeMoved,
} from './gameHelpers'
import {
  BALL_COLOR,
  BallPositionType,
  DefaultStateType,
} from './StoreDataTypes'

type Action<State> = {
  path: string
  payload: Partial<State>
}

const FIELD_WIDTH_IN_CELLS = 9
const FIELD_HEIGHT_IN_CELLS = 9
const emptyField = generateEmptyField(
  FIELD_HEIGHT_IN_CELLS,
  FIELD_WIDTH_IN_CELLS
)
const defaultState: DefaultStateType = {
  field: insertBalls(emptyField, 3),
  activeBallPos: {
    row: -1,
    col: -1,
  },
  settings: {
    width: FIELD_WIDTH_IN_CELLS,
    height: FIELD_HEIGHT_IN_CELLS,
  },
  timer: 0,
  score: 0,
}

export type AppState = typeof defaultState
enum EVENT {
  CHANGE = 'change',
}

export class Store<State extends Record<string, any>> extends EventBus<EVENT> {
  static EVENT = EVENT
  state: State
  constructor(initialState: State) {
    super()
    this.state = initialState
  }

  getState() {
    return this.state
  }

  private set(nextState: Partial<State>) {
    const prevState = this.state
    this.state = merge(cloneDeep(prevState), nextState)
    this.emit(EVENT.CHANGE, prevState, this.state)
  }

  dispatch(action: Action<State>) {
    if (!exactEqual(this.state, action.payload, action.path)) {
      this.set(action.payload)
      return true
    }
    return false
  }

  actionCreator<Data extends {}>(path: string, cb = (p: Data): any => p) {
    return (payload: Data) => ({
      path,
      payload: objectFromPath(path, cb(payload)),
    })
  }
}

export const store = new Store(defaultState)
const selectorField = () => store.getState().field
export const Selectors = {
  field: selectorField,
}

const setActiveBallPos = store.actionCreator<{ row: number; col: number }>(
  'activeBallPos',
  ({ row, col }) => {
    return {
      row,
      col,
    }
  }
)

const resetActiveBallPos = store.actionCreator<{}>('activeBallPos', () => {
  return {
    row: -1,
    col: -1,
  }
})

const moveActiveBall = store.actionCreator<{ row: number; col: number }>(
  'field',
  ({ row, col }) => {
    const copy = cloneDeep(store.state.field)
    const { row: activeBallRow, col: activeBallCol } = store.state.activeBallPos
    const ballColor = copy[activeBallRow][activeBallCol]
    copy[activeBallRow][activeBallCol] = BALL_COLOR.EMPTY
    copy[row][col] = ballColor
    return copy
  }
)

const addRandomBalls = store.actionCreator<{}>('field', () => {
  const copy = cloneDeep(store.state.field)
  return insertBalls(copy, 3)
})

const removeListOfBalls = store.actionCreator<{ list: BallPositionType[] }>(
  'field',
  ({ list }) => {
    const copy = cloneDeep(store.state.field)
    for (let { row, col } of list) {
      copy[row][col] = BALL_COLOR.EMPTY
    }
    return copy
  }
)

const addScorePoints = store.actionCreator<{ score: number }>(
  'score',
  ({ score }) => {
    return store.state.score + score
  }
)

export const Actions = {
  setActiveBallPos,
  resetActiveBallPos,
  moveActiveBall,
  addRandomBalls,
  removeListOfBalls,
  addScorePoints,
}

const moveBall = (row: number, col: number) => {
  if (
    !isBallCanBeMoved({
      field: store.state.field,
      startPos: [store.state.activeBallPos.row, store.state.activeBallPos.col],
      endPos: [row, col],
    })
  ) {
    console.error(new Error('Move error'))
    return
  }

  store.dispatch(
    Actions.moveActiveBall({
      row,
      col,
    })
  )
  store.dispatch(Actions.resetActiveBallPos({}))

  // find win lines
  const { horizontalWinLines, verticalWinLines } = findWinLines(
    store.state.field
  )

  if (horizontalWinLines.length > 0 || verticalWinLines.length > 0) {
    const listOfPositions = [
      ...horizontalWinLines.flat(1),
      ...verticalWinLines.flat(1),
    ]
    const winLines = [...horizontalWinLines, ...verticalWinLines]
    const score = evaluateScorePointsByLines(winLines)
    store.dispatch(Actions.removeListOfBalls({ list: listOfPositions }))
    store.dispatch(Actions.addScorePoints({ score }))
    //   app points
  } else {
    store.dispatch(Actions.addRandomBalls({}))
  }
}

export const ActionsBatch = {
  moveBall,
}
