document.addEventListener('DOMContentLoaded', () => {
    const mode = document.getElementById('mode').dataset.current_mode;
    const nav_links = document.getElementsByClassName('nav-link');
    if (mode === '') {
        Array.prototype.forEach.call(nav_links, (link) => {
            link.classList.add('disabled');
        });
    }
});
