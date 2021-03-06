document.addEventListener('DOMContentLoaded', () => {
    prepareNavbar();
});
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
            if (!replica) {
                link.classList.toggle('disabled', link.dataset.mode === 'replica');
            }
            else {
                link.classList.remove('disabled');
            }
        });
    }
}
//# sourceMappingURL=navbar.js.map