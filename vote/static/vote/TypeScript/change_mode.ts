import { addInputs, getCookie } from "./util";

export function changeMode(mode: string, replica?: boolean): void {
  // Change the current mode
  document.getElementById('mode').dataset.current_mode = mode
  document.getElementById('mode').innerHTML = modes_aliases[mode]

  // Changing the Navbar
  const nav_links = document.getElementsByClassName('nav-link');
  Array.prototype.forEach.call(nav_links, (link: HTMLAnchorElement) => {
    if (mode === link.dataset.mode) {
      link.classList.add('active')
    }

    if (replica === true) {
      link.classList.toggle('disabled', link.dataset.mode !== 'replica')
    } else {
      link.classList.remove('disabled')
    }
  })

  // Fetching to fill the inputs
  const query = `
    query GetModes($id1: ID!, $id2: ID!, $mode: String!) {
      comp1: compMode(id: $id1, mode: $mode) {
        mode
      }
      comp2: compMode(id: $id2, mode: $mode) {
        mode
      }
    }
  `

  fetch('/graphql/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({
      query,
      variables: {
        id1: JSON.parse(localStorage.getItem('comp_1')).id,
        id2: JSON.parse(localStorage.getItem('comp_2')).id,
        mode: mode
      }
    }),
    credentials: 'include'
  })
  .then(response => {
    if (!response.ok) {
      throw Error(`${response.statusText} - ${response.url}`);
    }
    return response.json()
  })
  .then((data: GetModes) => {
    if (data.data.comp1 !== null) {
      addInputs(data.data.comp1.length, data)
    }
  })
}

window.addEventListener('popstate', event => {

})

const modes_aliases = {
  easy: 'Easy Mode',
  hard: 'Hard Mode',
  tematicas: 'Temáticas',
  random_mode: 'Random Mode',
  min1: 'Primer Minuto',
  min2: 'Segundo Munuto',
  deluxe: 'Deluxe',
  replica: 'Réplica'
}

function getKeyByValue(object: object, value: string) { 
  return Object.keys(object).find(key => object[key] === value); 
}

export type GetModes = {
  data: {
    comp1: number[] | null,
    comp2: number[] | null
  }
}