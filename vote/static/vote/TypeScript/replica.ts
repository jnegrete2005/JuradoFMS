import { Competitor } from './classes.js';
import { get_winner } from './util.js';

export function fillRepTable(): void {
  // Populate fields
  for (let i = 1; i <= 2; i++) {
    const comp = Competitor.unserialize(localStorage.getItem(`comp_${i}`));

    Array.from(document.getElementsByClassName(`comp-${i}-rep`)).forEach(
      (el: HTMLTableHeaderCellElement | HTMLTableDataCellElement, j) => {
        if (j === 0) {
          el.innerHTML = comp.name;
        } else {
          el.innerHTML = comp.get_sum('replica').toString();
        }
      }
    );
  }

  // Get winner
  const winner = get_winner(
    Competitor.unserialize(localStorage.getItem('comp_1')),
    Competitor.unserialize(localStorage.getItem('comp_2')),
    true
  );

  document.getElementById('rep-winner').innerHTML = winner;

  // Show and hide sections
  document.getElementById('end-container').classList.add('d-none');
  document.getElementById('poll-container').classList.add('d-none');
  document.getElementById('rep-res-container').classList.remove('d-none');
}
