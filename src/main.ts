import { init as linesGameInit } from './lines-game'
import './styles.css'

const app = document.querySelector<HTMLDivElement>('#app')
app!.innerHTML = `
    <main>
        <div id="lines-game"></div>
    </main>
`
linesGameInit()
