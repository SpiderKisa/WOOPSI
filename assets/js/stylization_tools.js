const form = document.querySelector('#form-new-post');
form.addEventListener('submit', e => {
    e.preventDefault();
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