import { changeMode } from './change_mode.js';
import { Competitor } from './classes.js';
import { createError, getCookie, get_winner, plus_counter, useModal } from './util.js';
export function fillRepTable() {
    // Populate fields
    for (let i = 1; i <= 2; i++) {
        const comp = Competitor.unserialize(localStorage.getItem(`comp_${i}`));
        Array.from(document.getElementsByClassName(`comp-${i}-rep`)).forEach((el, j) => {
            if (j === 0) {
                el.innerHTML = comp.name;
            }
            else {
                el.innerHTML = comp.get_sum('replica').toString();
            }
        });
    }
    // Get winner
    const winner = get_winner(Competitor.unserialize(localStorage.getItem('comp_1')), Competitor.unserialize(localStorage.getItem('comp_2')), true);
    if (winner === 'decide') {
        document.getElementById('rep-btn').dataset.decide = 'true';
        // Add event listeners to decide inputs
        Array.from(document.getElementsByClassName('choice-input')).forEach((el, i) => {
            el.innerHTML = Competitor.unserialize(localStorage.getItem(`comp_${i + 1}`)).name;
            el.addEventListener('click', () => {
                localStorage.setItem('winner', el.innerHTML);
            });
        });
        // Show the decide boxes
        document.getElementById('choices-form').classList.replace('d-none', 'd-flex');
    }
    else {
        document.getElementById('rep-btn').dataset.decide = 'false';
    }
    document.getElementById('rep-winner').innerHTML = winner === 'decide' ? 'Réplica' : winner;
    document.getElementById('rep-btn').innerHTML = winner === 'Réplica' ? 'Réplica' : 'Terminar';
    // Show and hide sections
    document.getElementById('end-container').classList.add('d-none');
    document.getElementById('poll-container').classList.add('d-none');
    document.getElementById('rep-res-container').classList.remove('d-none');
}
document.getElementById('prev-rep-btn').addEventListener('click', () => {
    history.pushState({ old_mode: 'end_replica', new_mode: 'replica' }, '', '#replica');
    changeMode('end_replica', 'replica');
    localStorage.removeItem('winner');
});
document.getElementById('rep-btn').addEventListener('click', () => {
    const rep_btn = document.getElementById('rep-btn');
    if (rep_btn.innerHTML === 'Terminar' && rep_btn.dataset.decide === 'false') {
        reload();
        return;
    }
    else if (rep_btn.dataset.decide === 'true' && localStorage.getItem('winner')) {
        // Define vars
        const winner = localStorage.getItem('winner');
        if (!validWinner(winner)) {
            return useModal('Has tocado algo que no debiste.', 'El competidor que has escogido no existe.');
        }
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
            .then((reponse) => reponse.json())
            .then((data) => {
            if (data.errors) {
                throw Error('No se pudo guardar el ganador');
            }
            reload();
            return;
        })
            .catch((err) => {
            createError(err);
        });
        return;
    }
    else if (rep_btn.dataset.decide === 'false' && !localStorage.getItem('winner')) {
        history.pushState({ old_mode: 'end_replica', new_mode: 'replica' }, '', '#replica');
        cleanReplicaValues();
        changeMode('end_replica', 'replica');
        plus_counter();
    }
    else {
        useModal('No has escogido un ganador!', 'Como no ha habido un ganador, tienes que escoger uno tú mism@, de lo contrario, no habrá uno!\nPara escoger uno, solo hazle click a la cajita con el competidor que opinas que mejor desempeñó durante toda la batalla');
    }
});
function cleanReplicaValues() {
    // Clean the db
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
    fetch('/graphql/', {
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
                mode: 'replica',
                value1: [9, 9, 9, 9, 9, 9, 9, 9, 9],
                value2: [9, 9, 9, 9, 9, 9, 9, 9, 9],
            },
        }),
    });
    // Clean the cached info
    const comp_1 = Competitor.unserialize(localStorage.getItem('comp_1'));
    const comp_2 = Competitor.unserialize(localStorage.getItem('comp_2'));
    comp_1.replica = [9, 9, 9, 9, 9, 9, 9, 9, 9];
    comp_2.replica = [9, 9, 9, 9, 9, 9, 9, 9, 9];
    localStorage.setItem('comp_1', comp_1.serialize());
    localStorage.setItem('comp_2', comp_2.serialize());
}
function validWinner(winner) {
    const poss_win = [Competitor.unserialize(localStorage.getItem('comp_1')).name, Competitor.unserialize(localStorage.getItem('comp_2')).name];
    return poss_win.includes(winner);
}
function reload() {
    location.assign(location.href.split('/').slice(0, 3).join('/'));
}
//# sourceMappingURL=replica.js.map