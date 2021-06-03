prepareNavbar();

export function prepareNavbar(mode?: string, replica?: boolean) {
  const nav_links = Array.from(document.getElementsByClassName('nav-link'));
  // First time
  if (!mode) {
    // Disable all since comps haven't been chosen
    nav_links.forEach((link: HTMLAnchorElement) => {
      link.classList.add('disabled');
    });
  } else {
    nav_links.forEach((link: HTMLAnchorElement) => {
      // Make the mode chosen active
      link.classList.toggle('active', link.dataset.mode === mode);

      // Enable replica btn if end is false or mode is replica
      if ((document.getElementById('end-btn').dataset.isEnd === 'false' && (mode === 'replica' || mode === 'end')) || replica) {
        link.classList.remove('disabled');
      }

      // Else disable all modes except replica
      else {
        link.classList.toggle('disabled', link.dataset.mode === 'replica');
      }
    });
  }
}
