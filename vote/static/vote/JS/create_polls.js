import { addInputs, createAlert, createError, getCookie } from './util.js';
import { Competitor } from './classes.js';
import { prepareNavbar } from './navbar.js';
document.getElementById('comps-form').addEventListener('submit', (event) => createPoll(event));
function createPoll(event) {
    event.preventDefault();
    const comp_form = document.getElementById('comps-form');
    if (comp_form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        comp_form.classList.add('was-validated');
        return;
    }
    const comp1 = document.getElementById('comp-1-input').value.trim();
    const comp2 = document.getElementById('comp-2-input').value.trim();
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
        .then((response) => response.json())
        .then((data) => {
        // Get the data of the competitors
        const comp_1 = new Competitor(data.data.createPoll.poll.comp1.id, data.data.createPoll.poll.comp1.name);
        const comp_2 = new Competitor(data.data.createPoll.poll.comp2.id, data.data.createPoll.poll.comp2.name);
        // Save it in local storage
        localStorage.setItem('comp_1', comp_1.serialize());
        localStorage.setItem('comp_2', comp_2.serialize());
        localStorage.setItem('poll', data.data.createPoll.poll.id.toString());
        // Hide and show the views
        document.getElementById('choose-comps').classList.add('visually-hidden');
        document.getElementById('poll-container').classList.remove('visually-hidden');
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
//# sourceMappingURL=create_polls.js.map