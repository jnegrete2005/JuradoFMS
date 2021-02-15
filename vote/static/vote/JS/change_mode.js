import { prepareNavbar } from "./navbar";
import { VotingPoll } from "./types";
import { addInputs, createAlert, getCookie } from "./util";
function saveMode(mode) {
    // Create the mutation
    const mutation = `
    mutation SaveMode($id1: ID!, $id2: ID!, $mode: String!, $value1: [Int]!, $value2: [Int]!) {
      comp1: saveMode(id: $id1, mode: $mode, value: $value1) {
        comp {
          ${mode}
        }
      }
      comp2: saveMode(id: $id2, mode: $mode, value: $value2) {
        comp {
          ${mode}
        }
      }
    }
  `;
    // Fetch
    fetch('/graphql/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            query: mutation,
            variables: {
                "id1": VotingPoll.unserialize(localStorage.getItem('poll')).comp_1.id,
                "id2": VotingPoll.unserialize(localStorage.getItem('poll')).comp_2.id,
                "mode": mode,
            }
        })
    });
}
function changeMode(mode) {
    // Change the current mode
    document.getElementById('mode').dataset.current_mode = mode;
    document.getElementById('mode').innerHTML = modes_aliases[mode];
    // Create the query
    const query = `
    query GetModes($pollID: ID!) {
      votingPoll(id: $pollID) {
        id
        comp1 {
          mode: ${mode}
        }
        comp2 {
          mode: ${mode}
        }
      }
    }
  `;
    // Fetch
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
        return response.json();
    })
        .then((data) => {
        // Fill the inputs
        if (data.data.comp1 !== null) {
            addInputs(data.data.comp1.length, data);
        }
        else {
            switch (mode) {
                case 'tematicas':
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
        // Create the alert 
        createAlert('Recuerda que los últimos 3 cuadritos siempre son para Skills, Flow y Puesta en escena');
        // Fill the heading with the mode
        document.getElementById('mode').dataset.current_mode = mode;
        document.getElementById('mode').innerHTML = modes_aliases[mode];
        // Prepare the navbar
        prepareNavbar(mode);
    });
}
const modes_to_int = {
    easy: 0,
    hard: 1,
    tematicas: 2,
    random_mode: 3,
    min1: 4,
    min2: 5,
    deluxe: 6,
    replica: 7
};
const modes_aliases = {
    easy: 'Easy Mode',
    hard: 'Hard Mode',
    tematicas: 'Temáticas',
    random_mode: 'Random Mode',
    min1: 'Primer Minuto',
    min2: 'Segundo Munuto',
    deluxe: 'Deluxe',
    replica: 'Réplica'
};
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
