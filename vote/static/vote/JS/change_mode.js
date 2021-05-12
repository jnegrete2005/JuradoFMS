import { prepareNavbar } from './navbar.js';
import { modes_aliases, Competitor, mode_length } from './classes.js';
import { addInputs, arraysMatch, createAlert, createError, getCookie, setCookie } from './util.js';
async function saveMode(mode) {
    let comp_1 = Competitor.unserialize(localStorage.getItem('comp_1'));
    let comp_2 = Competitor.unserialize(localStorage.getItem('comp_2'));
    // Get the values
    const value1 = Array.from(document.getElementsByClassName('comp-1-input')).map(returnValueOr9);
    const value2 = Array.from(document.getElementsByClassName('comp-2-input')).map(returnValueOr9);
    if (mode.startsWith('min')) {
        const convertChecked = (el) => (el.checked ? 1 : 9);
        if (mode.charAt(mode.length - 1) === '1') {
            value1.push(...Array.from(document.getElementsByClassName('check-1')).map(convertChecked));
            value2.push(...new Array(9).fill(9));
        }
        else {
            value2.push(...Array.from(document.getElementsByClassName('check-2')).map(convertChecked));
            value1.push(...new Array(9).fill(9));
        }
    }
    try {
        validateLength(value1, value2, mode);
    }
    catch (e) {
        createError(e);
        return false;
    }
    const allEqualTo9 = (arr) => arr.every((v) => v === 9);
    if ((allEqualTo9(value1), allEqualTo9(value2))) {
        comp_1[mode] = value1;
        comp_2[mode] = value2;
        localStorage.setItem('comp_1', comp_1.serialize());
        localStorage.setItem('comp_2', comp_2.serialize());
        return true;
    }
    if (comp_1[mode] && comp_2[mode]) {
        if (arraysMatch(comp_1[mode], value1) && arraysMatch(comp_2[mode], value2)) {
            return true;
        }
    }
    // Create the mutation
    const mutation = `
    mutation SaveModes($id: ID!, $mode: String!, $value1: [Float]!, $value2: [Float]!) {
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
        const validInput = (number) => number >= 0 && number <= 4 && number % 0.5 === 0;
        return validInput(parseFloat(el.value)) ? parseFloat(el.value) : 9;
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
        .then((response) => {
        if (!response.ok)
            throw Error(`${response.statusText} - ${response.status}`);
        return response.json();
    })
        .then((data) => {
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
        .catch((err) => {
        createError(err);
        return false;
    });
    return result;
}
function nextMode(mode) {
    const comp_1 = Competitor.unserialize(localStorage.getItem('comp_1'))[mode];
    const comp_2 = Competitor.unserialize(localStorage.getItem('comp_2'))[mode];
    function next(data) {
        // Fill the heading with the mode
        document.getElementById('mode').dataset.current_mode = mode;
        document.getElementById('mode').innerHTML = modes_aliases[mode];
        // Fill the inputs
        if (data.data.comp1.mode !== null) {
            if (mode.startsWith('min')) {
                addInputs(9, data);
            }
            else {
                addInputs(data.data.comp1.mode.length, data);
            }
        }
        else {
            switch (mode) {
                case 'tematicas_1':
                case 'tematicas_2':
                    addInputs(7);
                    break;
                case 'random_score':
                    addInputs(11);
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
    }
    if (getCookie('isActive') === 'true') {
        let data;
        if (comp_1 && comp_2) {
            data = {
                data: {
                    comp1: {
                        mode: comp_1,
                    },
                    comp2: {
                        mode: comp_2,
                    },
                },
            };
        }
        else {
            data = {
                data: {
                    comp1: {
                        mode: new Array(mode_length[mode]).fill(9),
                    },
                    comp2: {
                        mode: new Array(mode_length[mode]).fill(9),
                    },
                },
            };
        }
        next(data);
        return;
    }
    else {
        setCookie('isActive', 'true', 0.3);
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
        .then((response) => {
        if (!response.ok)
            throw Error(`${response.statusText} - ${response.status}`);
        return response.json();
    })
        .then((data) => {
        if (data.errors) {
            throw Error(data.errors[0].message);
        }
        next(data);
    })
        .catch((err) => {
        createError(err);
    });
}
function prepareBtns(mode) {
    const previous = document.getElementById('previous');
    const next = document.getElementById('next');
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
export async function changeMode(old_mode, new_mode) {
    if (old_mode === 'end' || old_mode === 'end_replica') {
        if (new_mode === 'end') {
            document.getElementById('mode').dataset.current_mode = new_mode;
            prepareNavbar(new_mode);
            showSections(true);
            return;
        }
        wrapper();
        return;
    }
    else {
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
function showSections(end = false) {
    document.getElementById('end-container').classList.toggle('d-none', !end);
    document.getElementById('poll-container').classList.toggle('d-none', end);
    document.getElementById('rep-res-container').classList.add('d-none');
}
function validateLength(val1, val2, mode) {
    switch (mode) {
        case 'deluxe':
            if (val1.length !== 14 || val2.length !== 14) {
                throw new Error('Deluxe no puede tener ni más ni menos de 14 elementos');
            }
            break;
        case 'tematicas_1':
        case 'tematicas_2':
            if (val1.length !== 7 || val2.length !== 7) {
                throw new Error('Tematicas no puede tener más ni menos de 7 elementos');
            }
            break;
        case 'min1':
        case 'min2':
            if (val1.length !== 18 || val2.length !== 18) {
                throw new Error('Los minutos tienen que tener 18 elementos (los checks cuentan)');
            }
            break;
        case 'random_score':
            if (val1.length !== 11 || val2.length !== 11) {
                throw new Error('Random mode no puede tener más ni menos de 11 elementos');
            }
            break;
        default:
            if (val1.length !== 9 || val2.length !== 9) {
                throw new Error(`${modes_aliases[mode]} no puede tener más ni menos de 9 elementos`);
            }
    }
}
//# sourceMappingURL=change_mode.js.map