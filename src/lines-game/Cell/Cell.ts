import { BaseProps, Component } from '../_lib/Component'
import styles from './Cell.module.css'
import { withActiveBallPos, withField } from '../_lib/withStore'
import { Ball } from '../Ball/Ball'
import { BallPositionType, BALL_COLOR, FieldType } from '../_lib/StoreDataTypes'
import { Actions, ActionsBatch, store } from '../_lib/Store'

type CellProps = {
  row: number
  col: number
  field?: FieldType
  activeBallPos?: BallPositionType
} & BaseProps

class Cell extends Component<BaseProps> {
  constructor({ row, col, field = [], activeBallPos }: CellProps) {
    const ball = new Ball({ color: field[row][col] })
    super({
      row,
      col,
      field,
      activeBallPos,
      children: ball,
      events: {
        click: () => {
          const hasBallInCell = ball.props.color !== BALL_COLOR.EMPTY
          console.log(this.props.activeBallPos)
          const isActiveBallExist =
            this.props.activeBallPos &&
            this.props.activeBallPos.row !== -1 &&
            this.props.activeBallPos.col !== -1

          if (hasBallInCell) {
            store.dispatch(
              Actions.setActiveBallPos({
                row: this.props.row,
                col: this.props.col,
              })
            )
          } else if (isActiveBallExist) {
            // если клетка пустая и есть а
            ActionsBatch.moveBall(this.props.row, this.props.col)
          }
        },
      },
    })
  }

  componentDidUpdate(oldProps: BaseProps, newProps: BaseProps) {
    super.componentDidUpdate(oldProps, newProps)
    this.children?.map((child) => {
      if (typeof child === 'string') return
      child.setProps({ color: newProps.field[newProps.row][newProps.col] })
    })
  }

  render() {
    return `
      <button class="${styles.cell}">
        ${this.insertChildren()}
      </button>
    `
  }
}

export default withField(withActiveBallPos(Cell)) as typeof Cell
