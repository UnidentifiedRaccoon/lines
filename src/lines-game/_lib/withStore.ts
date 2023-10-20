import { BaseProps, Component } from './Component'
import { AppState, Store, store } from './Store'
import { isEqual } from './ObjectHelpers'

type MapStateToPropsType = (state: AppState) => Partial<AppState>
const connect = (mapStateToProps: MapStateToPropsType) => {
  return <T extends BaseProps = {}>(ComponentClass: typeof Component<T>) =>
    class extends ComponentClass {
      componentState: Partial<AppState>
      constructor(props: T) {
        const componentState = mapStateToProps(store.getState())
        super({ ...props, ...componentState })
        this.componentState = componentState
      }

      #onChangeUserCallback = (_: any, newState: AppState) => {
        // можем обращаться и к аргументам ф-ции
        const mappedNewState = mapStateToProps(newState)
        if (!isEqual(this.componentState, mappedNewState)) {
          // ToDo подумать как тут прописать типизацию
          this.setProps({ ...mappedNewState } as Partial<T>)
        }
        this.componentState = mappedNewState
      }

      componentDidMount() {
        super.componentDidMount()
        store.on(Store.EVENT.CHANGE, this.#onChangeUserCallback)
      }

      componentWillUnmount() {
        super.componentWillUnmount()
        store.off(Store.EVENT.CHANGE, this.#onChangeUserCallback)
      }
    }
}

export const withField = connect((state) => ({ field: state.field }))
export const withActiveBallPos = connect((state) => ({
  activeBallPos: state.activeBallPos,
}))
export const withScore = connect((state) => ({ score: state.score }))
export const withSettings = connect((state) => ({ settings: state.settings }))
