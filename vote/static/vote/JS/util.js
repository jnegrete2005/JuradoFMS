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
export function addInputs(lenght) {
    Array.prototype.forEach.call(document.getElementsByClassName('comp-container'), (comp_container) => {
        for (let i = 0; i < lenght; i++) {
            const container = document.createElement('div');
            container.classList.add('col', 'col-md', 'd-flex', 'justify-content-center', 'justify-content-lg-left');
            const input = document.createElement('input');
            input.type = 'number';
            input.classList.add('form-control');
            container.append(input);
            insertAfter(container, comp_container);
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
