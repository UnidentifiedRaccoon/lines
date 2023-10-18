import { BaseProps, Component } from '../_lib/Component'
import styles from './Score.module.css'
import { withScore } from '../_lib/withStore'

type ScoreProps = {
  score?: number
} & BaseProps

class Score extends Component<ScoreProps> {
  render() {
    return `
      <span class="${styles.score}">
        ${this.props.score}
      </span>
    `
  }
}

export default withScore(Score)
