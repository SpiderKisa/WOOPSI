let currentFocusedInput;

const menu = document.querySelector('#add-item-menu');

const form = document.querySelector('#form-new-post');
form.addEventListener('submit', e => {
    e.preventDefault();
})

const submitButton = document.querySelector('#btn-submit');
submitButton.onclick = e => {
    let index = 0;
    for (let child of form.children) {
        if (child.tagName === 'INPUT') {
            child.name = `post[input${index++}]`;
        }
    }
    form.submit();
}

const convertRemToPixels = (rem) => {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

const focusOnEmptyElement = (e) => {
    const input = e.currentTarget;
    moveMenu(input);
    currentFocusedInput = input;
}

const moveMenu = (input) => {//incorrect. should find a better solution
    const rect = input.getBoundingClientRect();
    menu.classList.remove('d-none');
    menu.style.position = 'absolute';
    menu.style.top = `${rect.y}px`;
    menu.style.left = `${rect.x - convertRemToPixels(3.25)}px`;
}

const textInputKeyUp = (e) => {
    const input = e.currentTarget;
    if (input.value !== '') {
        menu.classList.add('d-none');
        input.classList.remove('empty-post-element');
    } else {
        menu.classList.remove('d-none');
        input.classList.add('empty-post-element');
    }
}

const emptyPostElementOnInput = (e) => {
    emptyPostElement = e.currentTarget;
    if (emptyPostElement.value !== '') {
        emptyPostElement.classList.remove('empty-post-element');
        menu.classList.add('d-none');
        return;
    } else {
        emptyPostElement.classList.add('empty-post-element');
        menu.classList.remove('d-none');
    }
}

const placeholder = 'Начните печатать или выберете элемент';

const getNewEmptyElement = () => {
    const emptyElement = document.createElement('input');
    emptyElement.classList.add('form-control', 'empty-post-element', 'mb-3');
    emptyElement.placeholder = placeholder;
    emptyElement.addEventListener('focus', focusOnEmptyElement);
    emptyElement.addEventListener('keyup', textInputKeyUp);
    emptyElement.oninput = emptyPostElementOnInput;
    return emptyElement;
}

form.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const activeElement = document.activeElement;
        const emptyElement = getNewEmptyElement();
        activeElement.insertAdjacentElement("afterend", emptyElement);
        emptyElement.focus();
    }
})

const getInputHidden = () => {
    let input = document.createElement('input');
    input.type = 'hidden';
    return input;
}

const getImgPreview = (src) => {
    let img = document.createElement('img');
    img.src = src;
    img.classList.add('img-fluid', 'mb-3');
    return img;
}

const formUpload = document.querySelector('#form-upload');

const imgInput = document.querySelector('#image-upload');
imgInput.onchange = async e => {
    const [file] = imgInput.files
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {

        const imgPreview = getImgPreview(reader.result);
        currentFocusedInput.insertAdjacentElement('afterend', imgPreview);

        const inputHidden = getInputHidden();
        currentFocusedInput.insertAdjacentElement('afterend', inputHidden);

        const emptyElement = getNewEmptyElement();
        imgPreview.insertAdjacentElement('afterend', emptyElement);

        currentFocusedInput.remove();
        currentFocusedInput = emptyElement;

        const formData = new FormData();
        formData.append('image', file);

        axios.post('/posts/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                const data = res.data;
                imgPreview.src = data.url;
                inputHidden.value = `image-${data.url}-${data.filename}`;
            }).catch(e => {
                console.log('ERROR ', e)
            })

    }
}