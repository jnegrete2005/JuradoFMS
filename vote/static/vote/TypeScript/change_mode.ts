import { prepareNavbar } from './navbar.js';
import { modes_aliases, Competitor } from './classes.js';
import { addInputs, arraysMatch, createAlert, createError, getCookie } from './util.js';

import type { SaveModes, GetModes } from './types';

async function saveMode(mode: string): Promise<boolean> {
  let comp_1 = Competitor.unserialize(localStorage.getItem('comp_1'));
  let comp_2 = Competitor.unserialize(localStorage.getItem('comp_2'));

  // Get the values
  const value1 = Array.from(document.getElementsByClassName('comp-1-input')).map(returnValueOr9);
  const value2 = Array.from(document.getElementsByClassName('comp-2-input')).map(returnValueOr9);

  if (comp_1[mode] && comp_2[mode]) {
    if (arraysMatch(comp_1[mode], value1) && arraysMatch(comp_2[mode], value2)) {
      return true;
    }
  }

  // Create the mutation
  const mutation = `
    mutation SaveModes($id: ID!, $mode: String!, $value1: [Int]!, $value2: [Int]!) {
      saveModes(pollId: $id, mode: $mode, value1: $value1, value2: $value2) {
        comp1 {
          mode
        }
        comp2 {
          mode
        }
      }
    }
  `;

  // Returns the value of the input. If invalid, returns 9
  function returnValueOr9(el: HTMLInputElement): number {
    function validInput(inp: number | undefined): boolean {
      if (!inp || inp < 0 || inp > 4) {
        return false;
      } else {
        return true;
      }
    }

    return validInput(parseInt(el.value)) ? parseInt(el.value) : 9;
  }

  // Fetch
  const result = await fetch('/graphql/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        id: parseInt(localStorage.getItem('poll')),
        mode: mode,
        value1,
        value2,
      },
    }),
  })
    .then((response) => response.json())
    .then((data: SaveModes) => {
      if (data.errors) {
        throw Error(data.errors[0].message);
      }

      // Save the comps in localStorage
      comp_1[mode] = data.data.saveModes.comp1.mode;
      comp_2[mode] = data.data.saveModes.comp2.mode;

      localStorage.setItem('comp_1', comp_1.serialize());
      localStorage.setItem('comp_2', comp_2.serialize());

      return true;
    })
    .catch((err: Error) => {
      createError(err);
      return false;
    });

  return result;
}

function nextMode(mode: string): void {
  const comp_1: Array<number> | undefined = Competitor.unserialize(localStorage.getItem('comp_1'))[mode];
  const comp_2: Array<number> | undefined = Competitor.unserialize(localStorage.getItem('comp_2'))[mode];

  function next(data: GetModes) {
    // Fill the inputs
    if (data.data.comp1.mode !== null) {
      addInputs(data.data.comp1.mode.length, data);
    } else {
      switch (mode) {
        case 'tematicas_1':
        case 'tematicas_2':
          addInputs(7);
          break;

        case 'deluxe':
          addInputs(14);
          break;

        default:
          addInputs(9);
          break;
      }
    }

    // Refresh the alert
    createAlert('Recuerda que los últimos 3 cuadritos siempre son para Skills, Flow y Puesta en escena');

    // Fill the heading with the mode
    document.getElementById('mode').dataset.current_mode = mode;
    document.getElementById('mode').innerHTML = modes_aliases[mode];
  }

  if (comp_1 && comp_2) {
    const data: GetModes = {
      data: {
        comp1: {
          mode: comp_1,
        },
        comp2: {
          mode: comp_2,
        },
      },
    };

    next(data);
    return;
  }

  // Create the query
  const query = `
    query GetModes($id1: ID!, $id2: ID!, $mode: String!) {
      comp1: getMode(id: $id1, mode: $mode) {
        mode
      }
      comp2: getMode(id: $id2, mode: $mode) {
        mode
      }
    }
  `;

  // Fetch
  fetch('/graphql/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: JSON.stringify({
      query,
      variables: {
        id1: JSON.parse(localStorage.getItem('comp_1')).id,
        id2: JSON.parse(localStorage.getItem('comp_2')).id,
        mode: mode,
      },
    }),
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data: GetModes) => {
      if (data.errors) {
        throw Error(data.errors[0].message);
      }

      next(data);
    })
    .catch((err: Error) => {
      createError(err);
    });
}

function prepareBtns(mode: string): void {
  const previous = <HTMLButtonElement>document.getElementById('previous');
  const next = <HTMLButtonElement>document.getElementById('next');
  switch (mode) {
    case 'easy':
      previous.disabled = true;
      previous.classList.add('disabled');
      next.value = 'Siguiente';
      break;

    case 'deluxe':
    case 'replica':
      next.value = 'Terminar';
      previous.disabled = false;
      previous.classList.remove('disabled');
      break;

    default:
      previous.disabled = false;
      previous.classList.remove('disabled');
      next.value = 'Siguiente';
      break;
  }
}

export async function changeMode(old_mode: string, new_mode: string): Promise<void> {
  if (old_mode === 'end' || old_mode === 'end_replica') {
    if (new_mode === 'end') {
      document.getElementById('mode').dataset.current_mode = new_mode;
      prepareNavbar(new_mode);
      showSections(true);
      return;
    }
    wrapper();
    return;
  } else {
    if (!(await saveMode(old_mode))) {
      return;
    }
    switch (new_mode) {
      case 'end':
        document.getElementById('mode').dataset.current_mode = new_mode;
        prepareNavbar(new_mode);
        showSections(true);
        break;

      case 'end_replica':
        if (old_mode !== 'replica') {
          throw Error('Esta sección solo puede ser accedida después de Réplica.');
        }
        document.getElementById('mode').dataset.current_mode = new_mode;
        prepareNavbar('end');
        break;

      case 'replica':
        wrapper(true);
        break;

      default:
        wrapper();
        return;
    }
  }

  function wrapper(replica = false) {
    nextMode(new_mode);
    prepareBtns(new_mode);
    prepareNavbar(new_mode, replica);
    showSections();
    return;
  }
}

function showSections(end = false): void {
  document.getElementById('end-container').classList.toggle('d-none', !end);
  document.getElementById('poll-container').classList.toggle('d-none', end);
  document.getElementById('rep-res-container').classList.add('d-none');
}
