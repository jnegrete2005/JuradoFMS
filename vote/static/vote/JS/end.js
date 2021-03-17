import { Competitor, VotingPoll } from './classes.js';
export function fillTable() {
    // Hide and show sections
    document.getElementById('results-container').classList.remove('visually-hidden');
    document.getElementById('poll-container').classList.add('visually-hidden');
    document.getElementById('choose-comps').classList.add('visually-hidden');
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
    // Fill the winner TODO
    document.getElementById('winner').innerHTML = VotingPoll.unserialize(localStorage.getItem('poll')).get_winner();
}
//# sourceMappingURL=end.js.map