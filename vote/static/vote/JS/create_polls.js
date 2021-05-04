import { addInputs, createAlert, createError, getCookie } from './util.js';
import { Competitor } from './classes.js';
import { prepareNavbar } from './navbar.js';
const comp_form = document.getElementById('comps-form');
const input_1 = document.getElementById('comp-1-input');
const input_2 = document.getElementById('comp-2-input');
comp_form.addEventListener('submit', (event) => createPoll(event));
function createPoll(event) {
    event.preventDefault();
    if (!comp_form.checkValidity())
        return checkInputs(event);
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
        if (!response.ok)
            throw Error(`${response.statusText} - ${response.status}`);
        return response.json();
    })
        .then((data) => {
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
        const previous = document.getElementById('previous');
        previous.disabled = true;
        previous.classList.add('disabled');
        // Add the alert
        createAlert('Recuerda que los últimos 3 cuadritos siempre son para Skills, Flow y Puesta en escena');
    })
        .catch((err) => {
        createError(err);
    });
}
function checkInputs(event) {
    event.preventDefault();
    event.stopPropagation();
    // Get the input values
    const vals = [input_1.value.trim(), input_2.value.trim()];
    const els = [input_1, input_2];
    vals.forEach((val, i) => {
        if (val === '')
            return setErrorFor(els[i], 'Por favor, llene el campo para continuar');
        if (val.length < 2 || val.length > 20)
            return setErrorFor(els[i], 'El competidor tiene que tener entre 2 y 20 caracteres');
    });
    function setErrorFor(input, message) {
        const col = input.parentElement;
        const err = col.querySelector('div');
        // Add err message
        err.innerText = message;
        // Add the was-validated class
        col.parentElement.parentElement.classList.add('was-validated');
        return;
    }
}
//# sourceMappingURL=create_polls.js.map