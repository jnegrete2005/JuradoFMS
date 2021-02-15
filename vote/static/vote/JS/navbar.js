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
            if (link.dataset.mode === mode) {
                link.classList.add('active');
            }
            if (!replica) {
                link.classList.toggle('disabled', link.dataset.mode === 'replica');
            }
            else {
                link.classList.remove('disabled');
            }
        });
    }
}
