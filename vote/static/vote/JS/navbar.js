prepareNavbar();
export function prepareNavbar(mode, replica) {
    const nav_links = Array.from(document.getElementsByClassName('nav-link'));
    if (!mode) {
        nav_links.forEach((link) => {
            link.classList.add('disabled');
        });
    }
    else {
        nav_links.forEach((link) => {
            link.classList.toggle('active', link.dataset.mode === mode);
            if ((document.getElementById('end-btn').dataset.isEnd === 'false' && (mode === 'replica' || mode === 'end')) ||
                replica) {
                link.classList.remove('disabled');
            }
            else {
                link.classList.toggle('disabled', link.dataset.mode === 'replica');
            }
        });
    }
}
//# sourceMappingURL=navbar.js.map