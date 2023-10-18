import { isEqual } from './ObjectHelpers'
import parser from './Parser'
import { nanoid } from 'nanoid'

type ComponentChildren = Component<any>[] | string[]
type PropsChildren = Component<any>[] | Component<any> | string[] | string

export type BaseProps = {
  children?: PropsChildren
  events?: Record<string, EventListenerOrEventListenerObject>
  [index: string]: any
}

export class Component<Props extends BaseProps> {
  // @ts-ignore
  private element: HTMLElement
  id: string
  props: Props
  children?: ComponentChildren
  childrenIds?: string[]

  constructor(props: Props) {
    this.id = nanoid()
    this.props = this.#makePropsProxy(props)

    if (Array.isArray(this.props.children)) {
      this.children = this.props.children
    } else if (this.props.children) {
      // @ts-ignore
      this.children = [this.props.children]
    }

    this.#render()
  }

  setProps = (newProps: Partial<Props>) => {
    Object.assign(this.props, newProps)
  }

  #makePropsProxy(props: Props) {
    const self = this
    return new Proxy<Props>(props, {
      get(target: Record<string, unknown>, prop: string, receiver: any) {
        const value = Reflect.get(target, prop, receiver)
        return typeof value === 'function' ? value.bind(self) : value
      },
      set(
        target: Record<string, unknown>,
        prop: string,
        value: unknown,
        receiver: any
      ) {
        const oldProps = { ...target }
        const reflectNewProps = Reflect.set(target, prop, value, receiver)
        self.componentDidUpdate(oldProps as Props, target as Props)
        return reflectNewProps
      },
      deleteProperty() {
        throw new Error('Нет доступа')
      },
    })
  }

  componentDidMount() {
    if (this.children) {
      this.children.forEach((child) => {
        if (typeof child === 'string') return
        child.componentDidMount()
      })
    }
  }

  componentDidUpdate(oldProps: Props, newProps: Props) {
    const shouldUpdate = !isEqual(oldProps, newProps)
    if (shouldUpdate) {
      this.#render()
    }
  }

  componentWillUnmount() {
    if (this.children) {
      Object.values(this.children).forEach((child) =>
        child.componentWillUnmount()
      )
    }
  }

  #render() {
    const newElement = this.#compile()
    if (this.element) {
      this.element.replaceWith(newElement)
    }
    this.element = newElement
    this.#addListeners()
  }

  #compile() {
    const templateString = this.render()
    const newElement = parser.parseFromString(templateString, 'text/html').body
      .firstElementChild as HTMLElement | null
    if (!newElement) throw new Error('cant parse component template')
    this.children?.forEach((child) => {
      if (typeof child === 'string') return
      const stub = newElement.querySelector(`[data-slot-id="${child.id}"]`)
      if (!stub) {
        throw new Error('cant get stab: ' + child.id)
      }
      stub.replaceWith(child.getElement())
    })
    return newElement
  }

  insertChildren = () => {
    return (
      this.children
        ?.map((child) => {
          if (typeof child === 'string') return child
          return `<span data-slot-id="${child.id}"></span>`
        })
        .join(' ') || ''
    )
  }

  #addListeners() {
    if (!this.props.events) return
    const { events } = this.props
    Object.entries(events).forEach(([event, listener]) => {
      this.element.addEventListener(event, listener)
    })
  }

  render(): string {
    return ''
  }

  getElement() {
    return this.element
  }

  destroy() {
    // @ts-ignore
    this.element = null
    // @ts-ignore
    this.props = null
    // @ts-ignore
    this.children = null
  }
}
