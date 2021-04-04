import { Competitor } from './classes.js';
import { get_winner } from './util.js';
export function fillTable() {
    let mode;
    // Fill the table
    for (let i = 0; i < 2; i++) {
        const comp = Competitor.unserialize(localStorage.getItem(`comp_${i + 1}`));
        Array.from(document.getElementsByClassName(`comp-${i + 1}-table`)).forEach((el, j) => {
            j++;
            if (j === 1) {
                el.innerHTML = comp.name;
                return;
            }
            mode = Object.keys(comp)[j];
            if (mode === 'replica') {
                el.innerHTML = comp.get_total().toString();
                return;
            }
            el.innerHTML = comp.get_sum(mode).toString();
        });
    }
    // Fill the table's winner
    (function getWinner() {
        // Get the winner
        const winner = get_winner(Competitor.unserialize(localStorage.getItem('comp_1')), Competitor.unserialize(localStorage.getItem('comp_2')));
        document.getElementById('winner').innerHTML = winner;
        const end = document.getElementById('end-btn');
        if (winner === 'Réplica') {
            end.innerHTML = 'Avanzar a réplica';
            end.dataset.isEnd = 'false';
        }
        else {
            end.innerHTML = 'Terminar';
            end.dataset.isEnd = 'true';
        }
    })();
}
//# sourceMappingURL=end.js.map