import { getKeyByValue } from './util.js';
import { modes_to_int } from './classes.js';
import { changeMode } from './change_mode.js';

Array.from(document.getElementsByClassName('listen')).forEach((el: HTMLAnchorElement | HTMLInputElement) => {
  el.addEventListener('click', async (event: Event) => {
    event.preventDefault();

    // Get the modes
    const old_mode = document.getElementById('mode').dataset.current_mode;
    const new_mode =
      el.dataset.mode !== undefined
        ? el.dataset.mode
        : getKeyByValue(modes_to_int, modes_to_int[old_mode] + parseInt(el.dataset.op));

    if (new_mode === 'end') {
      history.pushState({ show_table: true, replica: false }, '', '#end');
      await changeMode(old_mode, new_mode);
      import('./end.js').then((module) => module.fillTable());
      return;
    } else if (new_mode === 'end_replica') {
      history.pushState({ show_table: true, replica: true }, '', '#end');
      await changeMode(old_mode, new_mode);
      return;
    }

    // Push State
    history.pushState({ new_mode, show_table: false }, '', `#${new_mode}`);
    changeMode(old_mode, new_mode);
  });
});
