import { BaseProps, Component } from '../_lib/Component'
import styles from './Game.module.css'
import Field from '../Field/Field'
import { StatsRow } from '../StatsRow/StatsRow'

export class Game extends Component<BaseProps> {
  constructor() {
    const statsRow = new StatsRow()
    const field = new Field({})
    super({
      children: [statsRow, field],
    })
  }

  render() {
    return `
      <div class="${styles.game}">
       ${this.insertChildren()}
      </div>
    `
  }
}
