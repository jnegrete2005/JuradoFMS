import { Competitor } from './classes.js';
import type { GetModes } from './types';

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

  Array.from(document.getElementsByClassName('comp-container')).forEach((comp_container: HTMLElement) => {
    for (let i = 0; i < lenght; i++) {
      // Create the container and add the classes
      const container = document.createElement('div');
      container.classList.add(
        'col-4',
        'col-md',
        'd-flex',
        'justify-content-center',
        'justify-content-lg-left',
        'input'
      );

      if (i > lenght - 3 && lenght % 3 !== 0) {
        if (Math.round(lenght % 3) === 2) {
          container.classList.replace('col-4', 'col-6');
        } else if (Math.round(lenght % 3) === 1 && i > lenght - 2) {
          container.classList.replace('col-4', 'col');
        }
      }

      // Create the inputs
      const input = document.createElement('input');
      input.type = 'number';

      if (comp_container.id === 'comp-1-container') {
        input.classList.add('form-control', 'comp-1-input');
      } else if (comp_container.id === 'comp-2-container') {
        input.classList.add('form-control', 'comp-2-input');
      }

      input.required = true;
      input.min = '0';
      input.max = '4';
      input.step = '0.5';
      input.maxLength = 3;

      container.append(input);

      // Populate inputs
      if (data) {
        if (comp_container.id === 'comp-1-container') {
          if (data.data.comp1.mode.length !== 0 && data.data.comp1.mode[i] !== 9) {
            input.value = data.data.comp1.mode[i].toString();
          }
        } else if (comp_container.id === 'comp-2-container') {
          if (data.data.comp2.mode.length !== 0 && data.data.comp2.mode[i] !== 9) {
            input.value = data.data.comp2.mode[i].toString();
          }
        }
      }

      // Insert the container after the competitor
      if (i === 0) {
        insertAfter(container, comp_container);
      } else {
        insertAfter(
          container,
          document.getElementsByClassName('input')[document.getElementsByClassName('input').length - 1] as HTMLElement
        );
      }
    }
  });
}

function insertAfter(newNode: HTMLElement, referenceNode: HTMLElement) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

export function createAlert(text: string | HTMLElement): void {
  const alert = `
  <div class="alert alert-warning alert-dismissible fade show mb-5" role="alert">
    ${text}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  `;

  document.getElementById('alert-container').innerHTML = alert;
}

if (typeof String.prototype.trim === 'undefined') {
  String.prototype.trim = function () {
    return String(this).replace(/^\s+|\s+$/g, '');
  };
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

export function get_winner(comp_1: Competitor, comp_2: Competitor, replica = false): string {
  // Case replica
  if (replica) {
    // If it is already in replica #2
    if (comp_1.counter === 1) {
      // Check if it is replica again
      if (
        comp_1.get_sum('replica') === comp_2.get_sum('replica') ||
        Math.abs(comp_1.get_sum('replica') - comp_2.get_sum('replica')) < 6
      ) {
        return 'decide';
      }

      // Return the winner
      const max = Math.max(comp_1.get_sum('replica'), comp_2.get_sum('replica'));
      return max === comp_1.get_sum('replica') ? comp_1.name : comp_2.name;
    }
    if (
      comp_1.get_sum('replica') === comp_2.get_sum('replica') ||
      Math.abs(comp_1.get_sum('replica') - comp_2.get_sum('replica')) < 6
    ) {
      return 'Réplica';
    }

    const max_num = Math.max(comp_1.get_sum('replica'), comp_2.get_sum('replica'));
    return SaveWinner(comp_1, comp_2, max_num);
  }

  // Normal case
  if (comp_1.get_total() === comp_2.get_total() || Math.abs(comp_1.get_total() - comp_2.get_total()) < 6) {
    return 'Réplica';
  }

  // Return and save the winner if there is one
  const max_num = Math.max(comp_1.get_total(), comp_2.get_total());
  return SaveWinner(comp_1, comp_2, max_num);
}

function SaveWinner(comp_1: Competitor, comp_2: Competitor, max_num: number) {
  const winner = max_num === comp_1.get_total() ? comp_1.name : comp_2.name;
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
  });

  return winner;
}

export function plus_counter(): void {
  // Get the comps
  const comp_1 = Competitor.unserialize(localStorage.getItem('comp_1'));
  const comp_2 = Competitor.unserialize(localStorage.getItem('comp_2'));

  // Add the values
  comp_1.counter++;
  comp_2.counter++;

  // Save the comps
  localStorage.setItem('comp_1', comp_1.serialize());
  localStorage.setItem('comp_2', comp_2.serialize());

  return;
}
