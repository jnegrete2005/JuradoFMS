document.addEventListener('DOMContentLoaded', () => {
  const mode = document.getElementById('mode').dataset.mode

  const nav_links = document.getElementsByClassName('nav-link');
  if (mode === '') {
    Array.prototype.forEach.call(nav_links, (link: HTMLAnchorElement) => {
      link.classList.add('disabled')
    })
  } else {
    Array.prototype.forEach.call(nav_links, (link: HTMLAnchorElement) => {
      if (link.dataset.mode === mode) {
        link.classList.add('active');
      }
    })
  }
})
