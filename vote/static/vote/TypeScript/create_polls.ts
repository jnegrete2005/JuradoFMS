import { addInputs, getCookie, useModal } from "./util.js";
import { Competitor } from "./types.js"

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('comps-form').addEventListener('submit', (event) => createPoll(event))
})

function createPoll(event: Event):void {
  event.preventDefault()

  const comp_form = <HTMLFormElement>document.getElementById('comps-form')

  if (comp_form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    comp_form.classList.add('was-validated');
    return;
  }

  const comp1 = (<HTMLInputElement>document.getElementById('comp-1-input')).value.trim();
  const comp2 = (<HTMLInputElement>document.getElementById('comp-2-input')).value.trim();

  const mutation = `
    mutation CreateComps($comp1: String!, $comp2: String!) {
      createCompetitors(comp1: $comp1, comp2: $comp2) {
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
  `;

  fetch('/graphql/#', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({ 
      query: mutation,
      variables: { comp1, comp2 }
    }),
    credentials: 'include',
  })
  .then(response => {
    if (!response.ok) {
      throw Error(`${response.statusText} - ${response.url}`);
    }
    return response.json();
  })
  .then((data: CreateCompetitors) => {
    // Get the data of the competitors
    const comp_1 = new Competitor(data.data.createCompetitors.comp1.id, data.data.createCompetitors.comp1.name)
    const comp_2 = new Competitor(data.data.createCompetitors.comp2.id, data.data.createCompetitors.comp2.name)

    // Save it in local storage
    localStorage.setItem('comp_1', comp_1.serialize())
    localStorage.setItem('comp_2', comp_2.serialize())

    // Hide and show the views
    document.getElementById('choose-comps').classList.add('visually-hidden')
    document.getElementById('poll').classList.remove('visually-hidden')

    // Add names
    document.getElementById('comp-1').innerHTML = comp_1.name
    document.getElementById('comp-2').innerHTML = comp_2.name

    // Add inputs
    addInputs(9)

    // Mode config
    history.pushState({mode: 'easy'}, '', '#easy')
  })
  .catch(err => {
    if (err.stack === 'TypeError: Failed to fetch') {
      err = 'Hubo un error en el proceso, intenta más tarde.'
    }
    useModal('Error', err);
  })
}

type CreateCompetitors = {
  data: {
    createCompetitors: {
      comp1: {
        id: number
        name: string
      }
      comp2: {
        id: number
        name: string
      }
    }
  }
}
