import { BaseProps, Component } from '../_lib/Component'
import Cell from '../Cell/Cell'
import styles from './Row.module.css'

type RowProps = {
  length: number
  position: number
} & BaseProps

export class Row extends Component<BaseProps> {
  /**
   * Constructor for the Row
   *
   * @param length - Length of the row in cells
   * @param position - Position in the list of rows
   *
   */
  constructor({ length, position }: RowProps) {
    const cells = [...Array(length)].map((_, i) => {
      return new Cell({ row: position, col: i })
    })

    super({
      length,
      position,
      children: cells,
    })
  }

  render() {
    return `
      <div class="${styles.row}">
        ${this.insertChildren()}
      </div>
    `
  }
}
