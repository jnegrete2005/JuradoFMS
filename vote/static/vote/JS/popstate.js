import { prepareNavbar } from './navbar.js';
import { changeMode } from './change_mode.js';
window.onpopstate = (event) => {
    if (event.state) {
        if (event.state.start) {
            prepareNavbar('easy');
        }
        else if (event.state.new_mode) {
            changeMode(event.state.old_mode, event.state.new_mode);
        }
    }
};
//# sourceMappingURL=popstate.js.map