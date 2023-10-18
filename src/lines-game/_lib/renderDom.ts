import { BaseProps, Component } from './Component'

export default function renderDOM(
  rootSelector: string,
  component: Component<BaseProps>
) {
  const root = document.querySelector(rootSelector)
  if (!root)
    throw new Error(
      'Отсутствует компонент для вставки или неправильный селектор'
    )
  root.innerHTML = ''
  root.append(component.getElement())
  component.componentDidMount()
}
