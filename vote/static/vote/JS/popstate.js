import { changeMode } from './change_mode.js';
window.onpopstate = (event) => {
    if (event.state) {
        const old_mode = document.getElementById('mode').dataset.current_mode;
        if (event.state.show_table) {
            if (!event.state.replica) {
                changeMode(old_mode, 'end');
            }
            else {
                changeMode(old_mode, 'end_replica');
            }
        }
        else if (event.state.new_mode) {
            changeMode(old_mode, event.state.new_mode);
        }
    }
};
//# sourceMappingURL=popstate.js.map