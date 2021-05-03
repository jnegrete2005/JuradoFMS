export function validate_inputs() {
    Array.from(document.querySelectorAll("input[type='number'].form-control")).forEach((el) => {
        el.addEventListener('keydown', (event) => {
            let val = el.value;
            let key = event.key;
            // Check the lenght of the value to determine what the key should be
            switch (val.length) {
                case 0:
                    try {
                        if (key === ' ' || key === '.')
                            return (el.value = '0.5');
                        if (check(parseFloat(key)) || key === 'Tab') {
                            break;
                        }
                        return event.preventDefault();
                    }
                    catch {
                        return event.preventDefault();
                    }
                case 1:
                    if (key === 'Tab' || key === 'Backspace')
                        break;
                    if ((key === ' ' || key === '.') && val !== '4') {
                        event.preventDefault();
                        el.value += '.5';
                        break;
                    }
                    return event.preventDefault();
                case 3:
                    if (key === 'Tab')
                        break;
                    if (key !== 'Backspace')
                        return event.preventDefault();
                    event.preventDefault();
                    el.value = val[0];
                    break;
                default:
                    return event.preventDefault();
            }
        });
    });
    const check = (number) => number >= 0 && number <= 4 && number % 0.5 === 0;
}
//# sourceMappingURL=validation.js.map