const form = document.querySelector('#form-new-post');
const submitButton = document.querySelector('#btn-submit');
const addItemMenu = document.querySelector('#add-item-menu');
const inputsName = 'post[inputs]';
const userId = document.querySelector('#userId').value;
const imageType = `image${userId}`;
const placeholder = 'Начните печатать или выберете элемент';
const createMenu = document.querySelector('#create-menu');

let currentFocusedInput;

const convertRemToPixels = (rem) => {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

let viewportHeight = window.innerHeight - createMenu.getBoundingClientRect().height - convertRemToPixels(2);

const updateViewportHeight = () => {
    const rect = createMenu.getBoundingClientRect();
    viewportHeight = window.innerHeight - rect.height - convertRemToPixels(2);
}

window.addEventListener('resize', updateViewportHeight);
window.addEventListener('orientationchange', updateViewportHeight);

const isInViewport = (element, whole = false) => {
    const rect = element.getBoundingClientRect();
    let position;
    if (whole) {
        position = rect.bottom / viewportHeight;
    } else {
        position = rect.top / viewportHeight;
    }
    return position >= 0 && position <= 1;
}

const scrollToBottomOfElement = (element) => {
    const rect = element.getBoundingClientRect();
    window.scrollTo({ behavior: 'smooth', left: 0, top: rect.bottom });//scroll isn' smooth
}

form.addEventListener('submit', e => {
    e.preventDefault();
})

submitButton.onclick = e => {
    form.submit();
}

const focusOnEmptyElement = (e) => {
    const input = e.currentTarget;
    moveAddItemMenu(input);
    currentFocusedInput = input;
}

const moveAddItemMenu = (input) => {//it breaks after empty element is added ang page is scrolled 
    const rect = input.getBoundingClientRect();
    addItemMenu.classList.remove('d-none');
    addItemMenu.style.top = `${rect.y}px`;
    addItemMenu.style.left = `${rect.x - convertRemToPixels(3.25)}px`;
}

const textareaOnKeyUp = (e) => {
    const input = e.currentTarget;
    if (input.value !== '') {
        addItemMenu.classList.add('d-none');
        input.classList.remove('empty-post-element');
    } else {
        addItemMenu.classList.remove('d-none');
        input.classList.add('empty-post-element');
    }
}

const postElementOnInput = (e) => {
    postElement = e.currentTarget;
    postElement.style.height = 0;
    postElement.value = postElement.value.replace(/(\r\n|\n|\r)/gm, "");
    postElement.style.height = (postElement.scrollHeight) + "px";

    if (!isInViewport(postElement, true)) {
        scrollToBottomOfElement(postElement);
    }

    if (postElement.value !== '') {
        postElement.classList.remove('empty-post-element');
        addItemMenu.classList.add('d-none');
    } else {
        postElement.classList.add('empty-post-element');
        addItemMenu.classList.remove('d-none');
    }
}

const getNewEmptyElement = () => {
    const emptyElement = document.createElement('textarea');
    emptyElement.classList.add('form-control', 'empty-post-element', 'mb-1', 'textarea-post', 'shadow-none');
    emptyElement.placeholder = placeholder;
    emptyElement.rows = '1';
    emptyElement.name = inputsName;
    emptyElement.addEventListener('focus', focusOnEmptyElement);
    emptyElement.addEventListener('keyup', textareaOnKeyUp);
    emptyElement.oninput = postElementOnInput;
    return emptyElement;
}


form.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const activeElement = document.activeElement;
        const emptyElement = getNewEmptyElement();
        activeElement.insertAdjacentElement("afterend", emptyElement);
        if (!isInViewport(emptyElement, true)) {
            scrollToBottomOfElement(emptyElement);
        }
        emptyElement.focus();
    }
})

const getNewInputHidden = () => {
    let input = document.createElement('input');
    input.type = 'hidden';
    input.name = inputsName;
    return input;
}

const getNewImgPreview = (src) => {
    let img = document.createElement('img');
    img.src = src;
    img.classList.add('img-fluid', 'mb-1');
    return img;
}

const formUpload = document.querySelector('#form-upload');

const imgInput = document.querySelector('#image-upload');
imgInput.onchange = async e => {
    const [file] = imgInput.files
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {

        const imgPreview = getNewImgPreview(reader.result);
        currentFocusedInput.insertAdjacentElement('afterend', imgPreview);

        const inputHidden = getNewInputHidden();
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
                inputHidden.value = [imageType, data.url, data.filename].join('<>');
            }).catch(e => {
                console.log('ERROR ', e)
            })

    }
}