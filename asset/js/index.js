const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let nameRegex = /^[a-zA-Z\s]{2,32}$/;
let emailRegex = /[a-z][a-z0-9_\.]{1,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}/;
let fieldInput = $$('input');

const fieldRequired = ['email', 'phone', 'full-name', 'address', 'city', 'postal-code'];
const checkEmpty = (feild, message) => {
    if (feild == "") {
        message.innerHTML = "Không được để trống";
    }
}
const getElementFieldRequired = (fieldRequired) => {
    let elementFieldRequired = [];
    fieldRequired.forEach((item, key) => {
        elementFieldRequired.push($(`#${item}`));
    })
    return elementFieldRequired;

}
const validation = () => {
    let fieldValidate = getElementFieldRequired(fieldRequired);
    fieldValidate.forEach((item, key) => {

        let formInputElement = item.closest('.form-input');
        let inputGroupElement = item.closest('.input-group');

        if (item.value === '') {
            if (!formInputElement.querySelector('.message-error')) {
                const node = document.createElement("span");
                node.classList.add('message-error');
                node.appendChild(document.createTextNode(`${item.getAttribute("data-error-name")} is required`));
                formInputElement.append(node);
                inputGroupElement.classList.add('input-text_error');
            }
        }
        item.addEventListener('change', (e) => {
            inputGroupElement.classList.remove('input-text_error');
            if (formInputElement.querySelector('.message-error')) {
                formInputElement.querySelector('.message-error').remove();
            }
        })
    })
}

function checkValid(feild, message, regex) {
    if (regex.test(feild) === false) {
        message.innerHTML = " Không hợp lệ!";
        checkEmpty(feild, message);
        return false;
    }
    if (regex.test(feild) === true) {
        message.innerHTML = "";
        return true;
    }
}


$('#form-checkout').addEventListener('submit', function (e) {
    e.preventDefault();
    console.log(1)
    validation();
    // const nameCheck = checkValid($('#firstname').value, $('#message_error1'), nameRegex);
    // const emailCheck = checkValid($('#email').value, $('#message_error5'), emailRegex);
    // const phone_numberCheck = checkValid($('#phone_number').value, $('#message_error6'), regexPhone);
    //
    // if (nameCheck == true && emailCheck == true && phone_numberCheck == true) {
    //
    //     $('#msg').classList.remove("hidden");
    //     $('#msg').innerHTML = "Gửi Liên Hệ Thành Công";
    // }
})