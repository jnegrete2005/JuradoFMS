import { prepareNavbar } from "./navbar.js"
import { saveMode } from "./change_mode.js"

window.addEventListener('popstate', event => {
  if (event.state !== null) {
    if (event.state.mode !== null) {
      if (event.state.start !== null) {
        prepareNavbar('easy')
      } else {
        // Save the old mode
        saveMode(event.state.old_mode)

        prepareNavbar(event.state.new_mode)
        
      }
    }
  }
})