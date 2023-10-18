import { GameManager } from './GameManager/GameManager'

const gameManager = new GameManager()
export const init = gameManager.init.bind(gameManager)
