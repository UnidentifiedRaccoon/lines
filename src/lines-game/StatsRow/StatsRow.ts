import { BaseProps, Component } from '../_lib/Component'
import styles from './StatsRow.module.css'
import Score from '../Score/Score'

type StatsRowProps = {
  score?: number
} & BaseProps

export class StatsRow extends Component<StatsRowProps> {
  constructor() {
    const score = new Score({})
    super({
      children: [score],
    })
  }

  render() {
    return `
      <div class="${styles.statsRow}">
       ${this.insertChildren()}
      </div>
    `
  }
}
