import { Row } from '../Row/Row'
import { BaseProps, Component } from '../_lib/Component'
import styles from './Field.module.css'
import { withSettings } from '../_lib/withStore'
import { SettingsType } from '../_lib/StoreDataTypes'

type FieldProps = {
  settings: SettingsType
} & BaseProps

class Field extends Component<BaseProps> {
  /**
   * Constructor for the Field
   *
   * @param settings - Width & Height of the game field in cells
   *
   */
  constructor({ settings }: FieldProps) {
    const rows = [...Array(settings.height)].map((_, i) => {
      return new Row({ length: settings.width, position: i })
    })

    super({
      settings,
      children: rows,
    })
  }

  render() {
    return `
      <div class="${styles.field}">
        ${this.insertChildren()}
      </div>
    `
  }
}

export default withSettings(Field)
