import { changeMode } from './change_mode.js';
import { Competitor } from './classes.js';
import { get_winner, plus_counter } from './util.js';

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

  if (winner === 'decide') {
    document.getElementById('rep-btn').dataset.decide = 'true';
  } else {
    document.getElementById('rep-btn').dataset.decide = 'false';
  }

  document.getElementById('rep-winner').innerHTML = winner === 'decide' ? 'Réplica' : winner;

  // TODO
  document.getElementById('rep-btn').innerHTML = winner === 'Réplica' || winner === 'decide' ? 'Réplica' : 'Terminar';

  // Show and hide sections
  document.getElementById('end-container').classList.add('d-none');
  document.getElementById('poll-container').classList.add('d-none');
  document.getElementById('rep-res-container').classList.remove('d-none');
}

document.getElementById('prev-rep-btn').addEventListener('click', () => {
  history.pushState({ old_mode: 'end_replica', new_mode: 'replica' }, '', '#replica');
  changeMode('end_replica', 'replica');
});

document.getElementById('rep-btn').addEventListener('click', () => {
  if (document.getElementById('rep-btn').innerHTML === 'Terminar') {
    location.assign('http://127.0.0.1:8000/vota/');
    return;
  }

  if (document.getElementById('rep-btn').dataset.decide === 'true') {
    // TODO
    return;
  }

  history.pushState({ old_mode: 'end_replica', new_mode: 'replica' }, '', '#replica');
  changeMode('end_replica', 'replica');
  plus_counter();
});
