import { addInputs, createAlert, createError, getCookie, setCookie } from './util.js';
import { Competitor } from './classes.js';
import { prepareNavbar } from './navbar.js';

import type { CreatePoll } from './types';

const comp_form = <HTMLFormElement>document.getElementById('comps-form');
const input_1 = <HTMLInputElement>document.getElementById('comp-1-input');
const input_2 = <HTMLInputElement>document.getElementById('comp-2-input');

[input_1, input_2].forEach((el: HTMLInputElement) => {
  el.addEventListener('input', (event) => {
    checkInput(event, el);
  });
});

comp_form.addEventListener('submit', (event) => createPoll(event));

function createPoll(event: Event): void {
  event.preventDefault();

  if (!checkInputs(event)) return;

  comp_form.classList.remove('was-validated');

  const comp1 = input_1.value.trim();
  const comp2 = input_2.value.trim();

  const mutation = `
    mutation CreatePoll($comp1: String!, $comp2: String!) {
      createPoll(comp1: $comp1, comp2: $comp2) {
        poll {
          id
          comp1 {
            id 
            name
          }
          comp2 {
            id
            name
          }
        }
      }
    }
  `;

  fetch('/graphql/#', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: JSON.stringify({
      query: mutation,
      variables: { comp1, comp2 },
    }),
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) throw Error(`${response.statusText} - ${response.status}`);
      return response.json();
    })
    .then((data: CreatePoll) => {
      if (data.errors) {
        throw Error(data.errors[0].message);
      }

      // Get the data of the competitors
      const comp_1 = new Competitor(data.data.createPoll.poll.comp1.id, data.data.createPoll.poll.comp1.name);
      const comp_2 = new Competitor(data.data.createPoll.poll.comp2.id, data.data.createPoll.poll.comp2.name);

      // Save it in local storage
      localStorage.setItem('comp_1', comp_1.serialize());
      localStorage.setItem('comp_2', comp_2.serialize());
      localStorage.setItem('poll', data.data.createPoll.poll.id.toString());

      // Delete winner
      localStorage.removeItem('winner');

      // Hide and show the views
      document.getElementById('choose-comps').classList.add('d-none');
      document.getElementById('poll-container').classList.remove('d-none');

      // Add names
      document.getElementById('comp-1').innerHTML = comp_1.name;
      document.getElementById('comp-2').innerHTML = comp_2.name;

      // Add inputs
      addInputs(9, null, true);

      // Mode config
      history.pushState({ new_mode: 'easy' }, 'Easy Mode', '#easy');
      prepareNavbar('easy');
      document.getElementById('mode').dataset.current_mode = 'easy';
      document.getElementById('mode').innerHTML = 'Easy Mode';

      // Make the previous btn disabled
      const previous = <HTMLInputElement>document.getElementById('previous');
      previous.disabled = true;
      previous.classList.add('disabled');

      // Add the alert
      createAlert('Recuerda que los últimos 3 cuadritos siempre son para Skills, Flow y Puesta en escena');

      setCookie('isActive', 'true', 0.5);
    })
    .catch((err: Error) => {
      createError(err);
    });
}

function checkInput(event: Event, el?: HTMLInputElement) {
  event.preventDefault();
  event.stopPropagation();

  // Get the input values
  const val = el.value.trim();

  if (val === '') return setErrorFor(el, 'Por favor, llene el campo para continuar');
  if (val.length < 2 || val.length > 20) return setErrorFor(el, 'El competidor tiene que tener entre 2 y 20 caracteres');
  if (val === 'replica' || val === 'Réplica') return setErrorFor(el, "El competidor no se puede llamar 'replica'");
  return setSuccessFor(el);
}

function checkInputs(event: Event) {
  event.preventDefault();
  event.stopPropagation();

  const vals = [input_1.value.trim(), input_2.value.trim()];
  const els = [input_1, input_2];

  let continue_func = 0;

  vals.forEach((val: string, i) => {
    if (val === '') return setErrorFor(els[i], 'Por favor, llene el campo para continuar');
    if (val.length < 2 || val.length > 20) return setErrorFor(els[i], 'El competidor tiene que tener entre 2 y 20 caracteres');
    if (val === 'replica' || val === 'Réplica') return setErrorFor(els[i], "El competidor no se puede llamar 'replica'");
    setSuccessFor(els[i]);
    continue_func++;
  });

  return continue_func === 2;
}

function setErrorFor(input: HTMLInputElement, message: string): false {
  const col = input.parentElement;
  const err = col.querySelector('div');

  // Add err message
  err.innerText = message;

  // Add the was-validated class
  col.parentElement.parentElement.classList.add('was-validated');

  input.classList.add('is-invalid');
  input.classList.remove('is-valid');
  input.setCustomValidity(message);

  return false;
}

function setSuccessFor(input: HTMLInputElement) {
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  input.setCustomValidity('');
  return true;
}
