import { Competitor, modes_to_int } from './classes.js';
import type { GetModes, SaveWinner } from './types';
import { validateModeInputs } from './validation.js';

export function getCookie(name: string): string {
  let cookieValue: null | string = null;

  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export function useModal(title: string, body: string): void {
  document.getElementById('modal-title').innerHTML = title;
  document.getElementById('modal-body').innerHTML = body;
  // @ts-ignore
  const modal = new bootstrap.Modal(document.getElementById('modal'));
  modal.toggle();
  document.getElementById('modal').addEventListener('hidden.bs.modal', () => {
    document.getElementById('modal-title').innerHTML = '';
    document.getElementById('modal-body').innerHTML = '';
  });
}

export function addInputs(lenght: number, data?: GetModes, first = false) {
  if (!first) {
    // Empty the inputs
    Array.from(document.getElementsByClassName('inputs-container')).forEach((container: HTMLDivElement) => {
      const comp = container.firstElementChild;
      container.innerHTML = '';
      container.append(comp);
    });
  }

  const mode = document.getElementById('mode').dataset.current_mode;
  const comp_1_cont = document.getElementById('comp-1').parentElement.parentElement;
  const comp_2_cont = document.getElementById('comp-2').parentElement.parentElement;

  // Alternate comps
  if (!first) {
    const poll = document.querySelector('.poll');
    const hr = poll.querySelector('hr');

    if (modes_to_int[mode] % 2 == 0 || mode === 'replica') {
      poll.insertBefore(comp_1_cont, comp_2_cont);
      poll.insertBefore(hr, comp_2_cont);
    } else {
      poll.insertBefore(comp_2_cont, comp_1_cont);
      poll.insertBefore(hr, comp_1_cont);
    }
  }

  Array.from(document.getElementsByClassName('comp-container')).forEach((comp_container: HTMLElement, i) => {
    for (let j = 0; j < lenght; j++) {
      // Create the container and add the classes
      const container = document.createElement('div');
      container.classList.add('input');

      // Add classes to not divisible by 3 inputs
      if (lenght % 3 !== 0 && (j === lenght - 5 || j === lenght - 4)) {
        if (Math.round(lenght % 3) === 2) {
          j === lenght - 5 ? container.classList.add('input-left') : container.classList.add('input-right');
        } else if (Math.round(lenght % 3) === 1 && j === lenght - 4) {
          container.classList.add('input-middle');
        }
      }

      // Add classes to extra inputs
      if (j > lenght - 4) {
        if (j === lenght - 3) {
          container.classList.add('input-extra-left');
        } else if (j === lenght - 1) {
          container.classList.add('input-extra-right');
        }
      }

      // Create the inputs
      const input = document.createElement('input');
      input.type = 'number';

      if (comp_container.id === 'comp-1-container') {
        input.classList.add('form-control', 'comp-1-input');
      } else {
        input.classList.add('form-control', 'comp-2-input');
      }

      input.required = true;
      input.min = '0';
      input.max = '4';
      input.step = '0.5';
      input.maxLength = 3;
      input.inputMode = 'decimal';

      // Tabindex edit
      if (mode === 'random_score' || mode === 'deluxe' || mode === 'replica') input.tabIndex = tabindex[mode][i][j];

      container.append(input);

      // Create min checkboxes
      if (mode.startsWith('min') && i === 1 && j < lenght - 3) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        if (comp_container.id === 'comp-1-container') {
          checkbox.classList.add('form-check-input', 'check-1');
        } else {
          checkbox.classList.add('form-check-input', 'check-2');
        }
        container.append(checkbox);
      }

      // Populate inputs
      if (data) {
        // Add the checkbox if the current is a rhyme input
        if (mode.startsWith('min') && i === 1 && j < lenght - 3) {
          (<HTMLInputElement>input.nextElementSibling).checked = data.data.comp2.mode[j + 9] === 1 ? true : false;
        }
        if (comp_container.id === 'comp-1-container') {
          if (data.data.comp1.mode.length !== 0 && data.data.comp1.mode[j] !== 9) {
            input.value = data.data.comp1.mode[j].toString();
          }
        } else {
          if (data.data.comp2.mode.length !== 0 && data.data.comp2.mode[j] !== 9) {
            input.value = data.data.comp2.mode[j].toString();
          }
        }
      }

      // Insert the container after the competitor
      if (j === 0) {
        insertAfter(container, comp_container);
      } else {
        insertAfter(container, document.getElementsByClassName('input')[document.getElementsByClassName('input').length - 1] as HTMLElement);
      }
    }
  });

  validateModeInputs();

  // Focus the first visible input
  if (first || modes_to_int[mode] % 2 == 0) {
    (<HTMLInputElement>comp_1_cont.getElementsByTagName('div')[1].firstElementChild).focus();
    return;
  }

  (<HTMLInputElement>comp_2_cont.getElementsByTagName('div')[1].firstElementChild).focus();
}

// The corresponding tabindex for custom tabindex modes
const tabindex = {
  random_score: [
    [1, 2, 5, 6, 9, 10, 13, 14, 17, 18, 19],
    [3, 4, 7, 8, 11, 12, 15, 16, 20, 21, 22],
  ],
  deluxe: [
    [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 24, 25],
    [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 26, 27, 28],
  ],
  replica: [
    [2, 4, 6, 8, 10, 12, 16, 17, 18],
    [1, 3, 5, 7, 9, 11, 13, 14, 15],
  ],
};

function insertAfter(newNode: HTMLElement, referenceNode: HTMLElement) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// Creates a bootstrap alert
export function createAlert(text: string | HTMLElement): void {
  const alert = `
  <div class="alert alert-info alert-dismissible fade show mb-5" role="alert">
    ${text}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  `;

  document.getElementById('alert-container').innerHTML = alert;
}

export function getKeyByValue(object: object, value: string | number) {
  return Object.keys(object).find((key) => object[key] === value);
}

export function createError(err: Error): void {
  if (err.stack === 'TypeError: Failed to fetch') {
    err.message = 'Hubo un error en el proceso, intenta más tarde.';
  }
  useModal('Error', err.message);
}

export function arraysMatch(arr1: Array<any>, arr2: Array<any>): boolean {
  // Check if the arrays are the same length
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Check if all items exist and are in the same order
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  // Otherwise, return true
  return true;
}

export function getWinner(comp_1: Competitor, comp_2: Competitor, replica = false): string {
  // Case replica
  if (replica) {
    // Get the replica sum of the comps
    const comp_1_rep = comp_1.get_sum('replica');
    const comp_2_rep = comp_2.get_sum('replica');

    // If it is already in replica #2
    if (comp_1.counter === 1) {
      // Check if it is replica again
      if (comp_1_rep === comp_2_rep || Math.abs(comp_1_rep - comp_2_rep) < 1) {
        return 'decide';
      }

      // Return the winner
      const max = Math.max(comp_1_rep, comp_2_rep);
      const winner = max === comp_1_rep ? comp_1.name : comp_2.name;
      saveWinner(winner);
      return winner;
    }

    if (comp_1_rep === comp_2_rep || Math.abs(comp_1_rep - comp_2_rep) <= 1) {
      return 'Réplica';
    }

    const max_num = Math.max(comp_1_rep, comp_2_rep);
    const winner = max_num === comp_1.get_sum('replica') ? comp_1.name : comp_2.name;
    saveWinner(winner);
    return winner;
  }

  // Get the total sum of the comps
  const comp_1_sum = comp_1.get_total();
  const comp_2_sum = comp_2.get_total();

  // Normal case
  if (comp_1_sum === comp_2_sum || Math.abs(comp_1_sum - comp_2_sum) < 5.5) {
    return 'Réplica';
  }

  // Return and save the winner if there is one
  const max_num = Math.max(comp_1_sum, comp_2_sum);
  const winner = max_num === comp_1.get_total() ? comp_1.name : comp_2.name;
  saveWinner(winner);
  return winner;
}

// Saves a new winner
function saveWinner(winner: string): void {
  const mutation = `
    mutation SaveWinner($id: ID!, $winner: String!) {
      saveWinner(pollId: $id, winner: $winner) {
        poll {
          winner
        }
      }
    }
  `;

  fetch('/graphql/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: JSON.stringify({
      query: mutation,
      variables: { id: parseInt(localStorage.getItem('poll')), winner: winner },
    }),
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) throw Error(`${response.statusText} - ${response.status}`);
      return response.json();
    })
    .then((data: SaveWinner) => {
      if (data.errors) {
        throw Error(data.errors[0].message);
      }
      return;
    })
    .catch((err: Error) => {
      createError(err);
    });
}

export function setCookie(cname: string, cvalue: string, exdays: number) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = 'expires=' + d.toUTCString();
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

export function reload() {
  location.assign(location.href.split('/').slice(0, 3).join('/'));
}
