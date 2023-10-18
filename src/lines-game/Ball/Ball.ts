import { BaseProps, Component } from '../_lib/Component'
import styles from './Ball.module.css'
import { BALL_COLOR } from '../_lib/StoreDataTypes'

type BallProps = {
  color: BALL_COLOR
} & BaseProps

export class Ball extends Component<BallProps> {
  constructor({ color }: BallProps) {
    super({
      color: color,
    })
  }

  render() {
    if (!this.props.color || this.props.color === BALL_COLOR.EMPTY)
      return '<span></span>'
    return `
      <span class="${styles.ball} ${styles[this.props.color]}">
      
      </span>
    `
  }
}
