import { changeMode } from './change_mode.js';
import { Competitor } from './classes.js';
import { getWinner, reload } from './util.js';

document.getElementById('prev-end-btn').addEventListener('click', () => {
  changeMode('end', 'deluxe');
});

export function fillTable(): void {
  let mode: string;

  // Fill the table
  for (let i = 1; i <= 2; i++) {
    const comp = Competitor.unserialize(localStorage.getItem(`comp_${i}`));

    Array.from(document.getElementsByClassName(`comp-${i}-table`)).forEach((el: HTMLTableHeaderCellElement | HTMLTableDataCellElement, j) => {
      j++;
      if (j === 1) {
        el.innerHTML = comp.name;
        return;
      }

      mode = Object.keys(comp)[j];

      // The mode after deluxe, so the total
      if (mode === 'replica') {
        el.innerHTML = comp.get_total().toString();
        return;
      }

      el.innerHTML = comp.get_sum(mode).toString();
    });
  }

  // Get the winner
  const winner = getWinner(Competitor.unserialize(localStorage.getItem('comp_1')), Competitor.unserialize(localStorage.getItem('comp_2')));

  // Show the winner
  document.getElementById('winner').innerHTML = winner;
  const end = document.getElementById('end-btn');

  // Add the state of replica to the page
  if (winner === 'Réplica') {
    end.innerHTML = 'Avanzar a réplica';
    end.dataset.isEnd = 'false';
    return;
  }

  end.innerHTML = 'Terminar';
  end.dataset.isEnd = 'true';
}

// Check for replica
document.getElementById('end-btn').addEventListener('click', () => {
  // If it wasn't a tie, just refresh the browser
  if (document.getElementById('end-btn').dataset.isEnd === 'true') {
    reload();
    return;
  }

  // Else, display replica
  document.getElementById('poll-container').classList.remove('d-none');
  document.getElementById('end-container').classList.add('d-none');
  document.getElementById('rep-res-container').classList.add('d-none');

  history.pushState({ old_mode: 'end', new_mode: 'replica' }, '', '#replica');
  changeMode(document.getElementById('mode').dataset.current_mode, 'replica');
});
