prepareNavbar();

export function prepareNavbar(mode?: string, replica?: boolean) {
  const nav_links = Array.from(document.getElementsByClassName('nav-link'));
  if (!mode) {
    nav_links.forEach((link: HTMLAnchorElement) => {
      link.classList.add('disabled');
    });
  } else {
    nav_links.forEach((link: HTMLAnchorElement) => {
      link.classList.toggle('active', link.dataset.mode === mode);

      if (!replica) {
        link.classList.toggle('disabled', link.dataset.mode === 'replica');
      } else {
        link.classList.remove('disabled');
      }
    });
  }
}
