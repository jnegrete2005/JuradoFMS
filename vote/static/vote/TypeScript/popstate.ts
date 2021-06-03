import { changeMode } from './change_mode.js';

window.onpopstate = (event: PopStateEvent) => {
  if (event.state) {
    const old_mode = document.getElementById('mode').dataset.current_mode;

    // If it has a table, display the correct one
    if (event.state.show_table) {
      if (!event.state.replica) {
        changeMode(old_mode, 'end');
      } else {
        changeMode(old_mode, 'end_replica');
      }
    }

    // Else, just change the mode
    else if (event.state.new_mode) {
      changeMode(old_mode, event.state.new_mode);
    }

    // TODO: make the comp choose case
  }
};
