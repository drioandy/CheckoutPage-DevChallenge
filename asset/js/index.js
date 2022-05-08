const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let nameRegex = /^[a-zA-Z\s]{2,32}$/;
let emailRegex = /[a-z][a-z0-9_\.]{1,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}/;
let phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
let postalCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;

const fieldRequired = ['email', 'phone', 'full-name', 'address', 'city', 'postal-code'];

const checkByRegex = (fieldId, regex, example) => {
    let element = $(`#${fieldId}`);

    let formInputElement = element.closest('.form-input');
    let inputGroupElement = element.closest('.input-group');
    // Check format
    if (!regex.test(element.value)) {
        if (!formInputElement.querySelector('.message-error')) {
            const node = document.createElement("span");
            node.classList.add('message-error');
            node.appendChild(document.createTextNode(`${element.getAttribute("data-error-name")} is not correct format. Example: ${example}`));
            formInputElement.append(node);
            inputGroupElement.classList.add('input-text_error');
        }
    }
    if (formInputElement.querySelector('.message-error')) {
        if (regex.test(element.value)) {
            formInputElement.querySelector('.message-error').remove();
            inputGroupElement.classList.remove('input-text_error');
        }
    }
    return regex.test(element.value);
}

const getElementFieldRequired = (fieldRequired) => {
    let elementFieldRequired = [];
    fieldRequired.forEach((item, key) => {
        elementFieldRequired.push($(`#${item}`));
    })
    return elementFieldRequired;
}

const checkRequired = (fieldRequired) => {
    let elementFieldRequired = getElementFieldRequired(fieldRequired);
    elementFieldRequired.forEach((item, key) => {

        let formInputElement = item.closest('.form-input');
        let inputGroupElement = item.closest('.input-group');
        // Check Required
        if (item.value === '') {
            if (!formInputElement.querySelector('.message-error')) {
                const node = document.createElement("span");
                node.classList.add('message-error');
                node.appendChild(document.createTextNode(`${item.getAttribute("data-error-name")} is required`));
                formInputElement.append(node);
                inputGroupElement.classList.add('input-text_error');
            }
        }

        if (formInputElement.querySelector('.message-error')) {
            if (item.value !== '') {
                formInputElement.querySelector('.message-error').remove();
                inputGroupElement.classList.remove('input-text_error');
            }
        }
    })
    return elementFieldRequired.every(item => item.value !== '')
}

const validation = (rules) => {
    return rules.every(rule => rule === true)
}

const openModal = () => {
    $('.modal').classList.remove('hidden');
    $('.overlay').classList.remove('hidden');
}
const hiddenModal = () => {
    $('.modal').classList.add('hidden');
    $('.overlay').classList.add('hidden');
}
const closeModal = () => {
    $('#modal-close').addEventListener('click', () => {
        hiddenModal();
    })
    $('.overlay').addEventListener('click', () => {
        hiddenModal();
    })
    document.addEventListener('keyup', (e) => {
        if (e.key === "Escape") { // escape key maps to keycode `27`
            hiddenModal();
        }
    });
}

$$('.checkout-item-qty__prepend').forEach(item => {
    item.addEventListener('click', (e) => {
        let qtyInput = item.closest('.checkout-item-qty').querySelector('.qty-input');
        let priceSale = item.closest('.checkout-item-info').querySelector('.price-sale').getAttribute('data-price');
        if (qtyInput.value > 0) {
            qtyInput.value = qtyInput.value - 1;
            $('#js-total').innerText = `$${calculateTotal()}`;
        }

    })
})
$$('.checkout-item-qty__append').forEach(item => {
    item.addEventListener('click', (e) => {
        let qtyInput = item.closest('.checkout-item-qty').querySelector('.qty-input');
        qtyInput.value = parseInt(qtyInput.value) + 1;
        $('#js-total').innerText = `$${calculateTotal()}`;
    })
})

const calculateTotal = () => {
    let total = 0;
    let shippingPrice = $('#js-shipping').getAttribute('data-price');

    $$('.qty-input').forEach(item => {
        let priceSale = item.closest('.checkout-item-info').querySelector('.price-sale').getAttribute('data-price');
        total += item.value * priceSale;
    })
    total += parseFloat(shippingPrice);
    return parseFloat(total).toFixed(2);

}
const stepOne = () => {
    openModal();
    closeModal();
    $('.modal-title').classList.remove('hidden');
    $('.modal-header').classList.remove('flex-right');

    $('.alert').classList.add('hidden');
    $('.order-info').classList.remove('hidden');
    $('.customer-information').classList.remove('hidden');
    let width = 0;
    window.addEventListener('resize', (e) => {
        width = document.body.offsetWidth;
        if (width > 568) {
            $('.modal').style.width = '70%';
        }
        if(width < 568) {
            $('.modal').style.width = '100%';
        }
    });


    let inputs = $$('.input-text');
    let selectCountry = $('.input-select');
    let getCountry = selectCountry.options[selectCountry.selectedIndex].text;
    inputs.forEach((item, key) => {
        let itemId = item.getAttribute('id');
        let modalItem = $(`#customer-info-${itemId}`);
        modalItem.innerText = item.value;
    })

    $('#customer-info-date').innerText = formatDate();
    $('#customer-info-country').innerText = getCountry;

    let cartItems = [];
    $$('.checkout-item-info').forEach((item, key) => {
        let data = {
            name: item.querySelector('.checkout-item-name').innerHTML,
            base_price: item.querySelector('.price-base').getAttribute('data-price'),
            discount: (item.querySelector('.price-base').getAttribute('data-price') - item.querySelector('.price-sale').getAttribute('data-price')).toFixed(2),
            sale_price: item.querySelector('.price-sale').getAttribute('data-price'),
            qty: item.querySelector('.qty-input').value,
            sub_total: item.querySelector('.price-sale').getAttribute('data-price') * item.querySelector('.qty-input').value
        }
        cartItems.push(data);
    })
    const result = cartItems.map((item, key) => {
        return `<tr>
                    <td>${key + 1}</td>
                    <td><div class="order-items-name">${item.name}</div></td>
                    <td><div class="order-items-price"><span class="order-item-price">${item.base_price}</span>$</div></td>
                    <td><div class="order-items-discount"><span class="order-item-price">${item.discount}</span>$ / 1 Item</div></td>
                    <td><div class="order-items-sale"><span class="order-item-price">${item.sale_price}</span>$</div></td>
                    <td><div class="order-items-qty">${item.qty}</div></td>
                    <td><div class="order-items-subtotal"><span class="order-item-price">${item.sub_total}</span>$</div></td>
                </tr>`
    })
    $('#table-body').innerHTML = result.join('');
    $('.order-total').innerHTML = calculateTotal();
    $('.modal-footer').classList.remove('hidden');
    if(width < 568){
        let subTotal = 0;
        const resultMobile = cartItems.map((item, key) => {
            subTotal += item.sub_total;
            return `<div class="checkout-order-product-wrap">

                            <div class="checkout-order-product">
                                <div class="order-items-name">${item.name}</div>
                                <span class="material-icons icons-close">close </span>
                                <div class="order-items-qty">${item.qty}</div>
                            </div>
                            <div class="checkout-order-product-price">
                                <div class="order-items-price"><span class="order-item-price">${item.sale_price}</span>$</div>
                                <div class="order-items-sale"><span class="order-item-price">${item.base_price}</span>$</div>
                            </div>

                        </div>`
        })
        $('.checkout-order-product-detail').innerHTML = resultMobile.join('');
        $('.order-total').innerText = `${calculateTotal()}$`;
        $('.order-subtotal').innerText = `${subTotal}$`;
        $('.modal-footer').classList.remove('hidden');
    }

}

const formatDate = () => {
    let date = new Date();
    return `${(date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate())}-${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${date.getSeconds()}`;
}

const stepTwo = () => {
    $('.modal-title').classList.add('hidden');
    $('.modal-header').classList.add('flex-right');

    $('.alert').classList.remove('hidden');
    $('.order-info').classList.add('hidden');
    $('.customer-information').classList.add('hidden');
    let width = 0;
    window.addEventListener('onresize', () => {
        width = document.body.offsetWidth;
        if (width > 568) {
            $('.modal').style.width = '45%';
        }
    });
    $('.alert-email').innerText = $('#email').value;
    $('.modal-footer').classList.add('hidden');
    resetForm();
}
const resetForm = () => {
    let form = $('#form-checkout');
    let inputElements = form.querySelectorAll('input');
    inputElements.forEach(el => {
        if (el.type === 'checkbox' && el.checked === true) {
            el.checked = false;
        }
        el.value = '';
    })
    let inputQty = $$('.qty-input');
    inputQty.forEach((el) => {
        el.value = 1;
    })
    $('#country').value = ''
    $('#js-total').innerText = `$${calculateTotal()}`;
}

$('#form-checkout').addEventListener('submit', function (e) {
    e.preventDefault();
    let rules = [
        checkRequired(fieldRequired),
        checkByRegex('email', emailRegex, 'user@gmail.com'),
        checkByRegex('phone', phoneRegex, '0123456789'),
        checkByRegex('postal-code', postalCodeRegex, '12345-1234'),
    ];

    if (!validation(rules)) {
        return false;
    }
    stepOne();
    let buttonCheckout = $('#checkout-button');
    if (buttonCheckout) {
        buttonCheckout.addEventListener('click', () => {
            stepTwo();
        })
    }
})





