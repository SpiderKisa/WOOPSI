const placeholder = 'Начните печатать или выберете элемент';
const menu = document.querySelector('#add-item-menu');

const form = document.querySelector('#form-new-post');
form.addEventListener('submit', e => {
    e.preventDefault();
})

function convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

const focusOnEmptyElement = (e) => {
    const input = e.currentTarget;
    const rect = input.getBoundingClientRect();
    menu.style.position = 'absolute';
    menu.style.top = `${rect.y}px`;
    menu.style.left = `${rect.x - convertRemToPixels(3.25)}px`;
}

const textInputKeyUp = (e) => {
    const input = e.currentTarget;
    if (input.value !== '') {
        menu.classList.add('d-none');
    } else {
        menu.classList.remove('d-none');
    }
}

form.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        const emptyElement = document.createElement('input');
        emptyElement.classList.add('form-control', 'empty-post-element', 'mb-3');
        emptyElement.placeholder = placeholder;
        emptyElement.name = 'post[text]';
        activeElement.insertAdjacentElement("afterend", emptyElement);
        emptyElement.addEventListener('focus', focusOnEmptyElement);
        emptyElement.addEventListener('keyup', textInputKeyUp);
        emptyElement.focus();
    }
})

// const imgInput = document.querySelector('#image-upload');
// imgInput.onchange = e => {
//     const [file] = imgInput.files
//     let reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = function () {
//         let preview = document.querySelector('#img-preview');
//         console.log(preview);
//         preview.src = reader.result;
//     }
// }

const emptyPostElement = document.querySelector('.empty-post-element');
emptyPostElement.oninput = e => {
    const menu = document.querySelector('.add-item-menu');
    if (emptyPostElement.value !== '') {
        emptyPostElement.classList.remove('empty-post-element');
        menu.style.display = 'none';
        return;
    } else {
        emptyPostElement.classList.add('empty-post-element');
        menu.style.display = 'block';
    }

}