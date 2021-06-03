export function validateModeInputs() {
  Array.from(document.querySelectorAll("input[type='number'].form-control")).forEach((el: HTMLInputElement) => {
    el.addEventListener('keydown', (event: KeyboardEvent) => {
      let key: string | number = event.key;

      if (validInputs.includes(key)) return;

      // Check the lenght of the value to determine what the key should be
      switch (el.value.length) {
        case 0:
          try {
            if (key === 'Backspace' || key === 'Tab') break;
            if (possible_decimals.includes(key)) {
              el.value = '0.5';
              break;
            }
            if (check(parseFloat(key))) break;
          } catch {
            event.preventDefault();
            break;
          }

        case 1:
          if (key === 'Backspace' || key === 'Tab') break;
          if (possible_decimals.includes(key) && el.value !== '4') {
            event.preventDefault();
            el.value += '.5';
            break;
          }
          event.preventDefault();
          break;

        case 3:
          if (key === 'Tab') break;
          if (key !== 'Backspace') {
            event.preventDefault();
            break;
          }
          event.preventDefault();
          el.value = el.value[0];
          break;

        default:
          break;
      }
    });
  });

  const check = (number: number) => number >= 0 && number <= 4 && number % 0.5 === 0;
}

const validInputs = ['Control', 'ArrowLeft', 'ArrowRight', 'Shift', 'Delete'];
const possible_decimals = ['.', ',', 'Unidentified', ' '];
