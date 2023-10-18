import { BaseProps, Component } from '../_lib/Component'
import styles from './Game.module.css'
import Field from '../Field/Field'
import Score from '../Score/Score'

export class Game extends Component<BaseProps> {
  constructor() {
    const score = new Score({})
    const field = new Field({})
    super({
      children: [score, field],
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
