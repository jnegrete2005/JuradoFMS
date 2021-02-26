import { getKeyByValue } from "./util.js";
import { modes_aliases, modes_to_int } from "./types.js";
document.addEventListener('DOMContentLoaded', () => addListeners());
function addListeners() {
    Array.from(document.getElementsByClassName('listen')).forEach((el) => {
        el.addEventListener('click', (event) => {
            event.preventDefault();
            const mode_el = document.getElementById('mode');
            // Get the modes
            const old_mode = mode_el.dataset.current_mode;
            const new_mode = el.dataset.mode !== undefined ? el.dataset.mode : getKeyByValue(modes_to_int, modes_to_int[old_mode] + parseInt(el.dataset.op));
            // Change the mode el
            mode_el.innerHTML = modes_aliases[new_mode];
            mode_el.dataset.current_mode = new_mode;
            // Push State
            history.pushState({ mode: new_mode, old_mode: old_mode }, '', `#${new_mode}`);
        });
    });
}