import { Game } from '../Game/Game'
import renderDOM from '../_lib/renderDom'

export class GameManager {
  game: Game
  constructor() {
    this.game = new Game()
  }

  init() {
    renderDOM('#lines-game', this.game)
  }
}
