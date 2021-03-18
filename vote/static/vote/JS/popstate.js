import { changeMode } from './change_mode.js';
window.onpopstate = (event) => {
    if (event.state) {
        if (event.state.new_mode) {
            changeMode(document.getElementById('mode').dataset.current_mode, event.state.new_mode);
        }
    }
};
//# sourceMappingURL=popstate.js.map