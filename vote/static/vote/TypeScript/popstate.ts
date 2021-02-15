import { prepareNavbar } from "./navbar.js"

window.addEventListener('popstate', event => {
  if (event.state !== null) {
    if (event.state.mode !== null) {
      if (event.state.start !== null) {
        prepareNavbar('easy')
      }
    }
  }
})