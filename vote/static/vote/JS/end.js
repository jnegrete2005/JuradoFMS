import { Competitor, VotingPoll } from "./classes.js";
export function fillTable() {
    // Make the table visible
    document.getElementById('results-container').classList.remove('visually-hidden');
    // Get the comps
    const comp_1 = Competitor.unserialize(localStorage.getItem('comp_1'));
    const comp_2 = Competitor.unserialize(localStorage.getItem('comp_2'));
    let mode;
    // Fill the table
    for (let i = 0; i < 2; i++) {
        Array.from(document.getElementsByClassName(`comp-${i + 1}-table`)).forEach((el, j) => {
            if (i === 0) {
                if (j === 0) {
                    el.innerHTML = comp_1.name;
                    return;
                }
                mode = Object.keys(comp_1)[j];
                el.innerHTML = comp_1.get_sum(mode).toString();
            }
            else {
                if (j === 0) {
                    el.innerHTML = comp_2.name;
                    return;
                }
                el.innerHTML = comp_2.get_sum(Object.keys(comp_2)[j]).toString();
            }
        });
    }
    // Fill the winner
    document.getElementById('winner').innerHTML = VotingPoll.unserialize(localStorage.getItem('poll')).get_winner();
}
//# sourceMappingURL=end.js.map