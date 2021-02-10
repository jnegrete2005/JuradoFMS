export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
export function useModal(title, body) {
    document.getElementById('modal-title').innerHTML = title;
    document.getElementById('modal-body').innerHTML = body;
    // @ts-ignore
    const modal = new bootstrap.Modal(document.getElementById('modal'));
    modal.toggle();
    document.getElementById('modal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('modal-title').innerHTML = '';
        document.getElementById('modal-body').innerHTML = '';
    });
}
export function addInputs(lenght, data) {
    if (data) {
        data.data.comp1.reverse();
        data.data.comp2.reverse();
    }
    Array.prototype.forEach.call(document.getElementsByClassName('comp-container'), (comp_container) => {
        for (let i = 0; i < lenght; i++) {
            // Create the container and add the classes
            const container = document.createElement('div');
            container.classList.add('col-4', 'col-md', 'd-flex', 'justify-content-center', 'justify-content-lg-left', 'input');
            if (i > lenght - 3 && lenght % 3 !== 0) {
                if (Math.round(lenght % 3) === 2) {
                    container.classList.replace('col-4', 'col-6');
                }
                else if (Math.round(lenght % 3) === 1 && i > lenght - 2) {
                    console.log(container.classList.replace('col-4', 'col'));
                }
            }
            // Create the inputs
            const input = document.createElement('input');
            input.type = 'number';
            if (comp_container.id === 'comp-1-container') {
                input.classList.add('form-control', 'comp-1-input');
            }
            else if (comp_container.id === 'comp-2-container') {
                input.classList.add('form-control', 'comp-2-input');
            }
            container.append(input);
            // Populate inputs
            if (data) {
                if (comp_container.id === 'comp-1-container') {
                    if (data.data.comp1 !== null && data.data.comp1[i] !== 9) {
                        input.value = data.data.comp1[i].toString();
                    }
                }
                else if (comp_container.id === 'comp-2-container') {
                    if (data.data.comp2 !== null && data.data.comp2[i] !== 9) {
                        input.value = data.data.comp2[i].toString();
                    }
                }
            }
            // Insert the container after the competitor
            if (i === 0) {
                insertAfter(container, comp_container);
            }
            else {
                insertAfter(container, document.getElementsByClassName('input')[document.getElementsByClassName('input').length - 1]);
            }
        }
    });
}
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
if (typeof (String.prototype.trim) === "undefined") {
    String.prototype.trim = function () {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}
