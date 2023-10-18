type Handler = (...args: any[]) => void

export default class EventBus<Events extends string | number> {
  subscribers: Partial<Record<Events, Handler[]>>
  constructor() {
    this.subscribers = {}
  }

  on(event: Events, handler: Handler) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = []
    }
    this.subscribers[event]!.push(handler)
  }

  off(event: Events, handler: Handler) {
    if (!this.subscribers[event]) return
    this.subscribers[event] = this.subscribers[event]!.filter(
      (h) => h !== handler
    )
  }

  emit(event: Events, ...args: any[]) {
    if (!this.subscribers[event]) return
    this.subscribers[event]!.forEach((h) => h(...args))
  }

  destroy() {
    this.subscribers = {}
  }
}
