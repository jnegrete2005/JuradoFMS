import { prepareNavbar } from './navbar.js';
import { changeMode } from './change_mode.js';

window.onpopstate = (event: PopStateEvent) => {
  if (event.state) {
    if (event.state.new_mode) {
      changeMode(document.getElementById('mode').dataset.current_mode, event.state.new_mode);
    }
  }
};
