import { prepareNavbar } from "./navbar.js";
import { VotingPoll, modes_aliases } from "./types.js";
import { addInputs, createAlert, getCookie } from "./util.js";
function saveMode(mode) {
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
    function returnValueOr9(el) {
        function validInput(inp) {
            if (!inp || inp < 0 || inp > 4) {
                return false;
            }
            else {
                return true;
            }
        }
        return validInput(parseInt(el.value)) ? parseInt(el.value) : 9;
    }
    // Get the values
    const value1 = Array.from(document.getElementsByClassName('comp-1-input')).map(returnValueOr9);
    const value2 = Array.from(document.getElementsByClassName('comp-2-input')).map(returnValueOr9);
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
                "id": VotingPoll.unserialize(localStorage.getItem('poll')).id,
                "mode": mode,
                value1,
                value2,
            }
        })
    });
}
function nextMode(mode) {
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
        if (data.data.comp1.mode.length !== 0 && data.data.comp1 !== undefined) {
            addInputs(data.data.comp1.mode.length, data);
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
        // Refresh the alert
        createAlert('Recuerda que los últimos 3 cuadritos siempre son para Skills, Flow y Puesta en escena');
        // Fill the heading with the mode
        document.getElementById('mode').dataset.current_mode = mode;
        document.getElementById('mode').innerHTML = modes_aliases[mode];
    });
}
function prepareBtns(mode) {
    const previous = document.getElementById('previous');
    switch (mode) {
        case 'easy':
            previous.disabled = true;
            previous.classList.add('disabled');
            break;
        case 'deluxe':
        case 'replica':
            document.getElementById('next').value = 'Terminar';
            previous.disabled = false;
            previous.classList.remove('disabled');
            break;
        default:
            previous.disabled = false;
            previous.classList.remove('disabled');
            break;
    }
}
export function changeMode(old_mode, new_mode) {
    saveMode(old_mode);
    nextMode(new_mode);
    prepareBtns(new_mode);
    prepareNavbar(new_mode);
}
