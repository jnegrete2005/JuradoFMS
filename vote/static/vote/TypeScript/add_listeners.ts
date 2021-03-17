import { getKeyByValue } from './util.js';
import { modes_to_int } from './classes.js';
import { changeMode } from './change_mode.js';
import { fillTable } from './end.js';

document.addEventListener('DOMContentLoaded', () => addListeners());

function addListeners(): void {
  Array.from(document.getElementsByClassName('listen')).forEach((el: HTMLAnchorElement | HTMLInputElement) => {
    el.addEventListener('click', (event: Event) => {
      event.preventDefault();

      const mode_el = document.getElementById('mode');

      // Get the modes
      const old_mode = mode_el.dataset.current_mode;
      const new_mode =
        el.dataset.mode !== undefined
          ? el.dataset.mode
          : getKeyByValue(modes_to_int, modes_to_int[old_mode] + parseInt(el.dataset.op));

      if (new_mode === 'replica') {
        history.pushState({ end: true }, '', '#end');
        fillTable();
        return;
      }

      // Push State
      history.pushState({ new_mode, old_mode }, '', `#${new_mode}`);
      changeMode(old_mode, new_mode);
    });
  });
}
