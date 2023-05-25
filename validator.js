
// Đối tượng 'Validator'
function Validator(options) {

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage = rule.test(inputElement.value);
            if (errorMessage) {
                errorElement.innerText = errorMessage;
                inputElement.parentElement.classList.add('invalid');
            } else {
                errorElement.innerText = '';
                inputElement.parentElement.classList.remove('invalid');
            }

            return !errorMessage;
    }

    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        // Khi submit form
        formElement.onSubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;

            // Lặp qua từng rule và validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);

                if (!isValid) {
                    isFormValid = false;
                }

            });

            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {
                    options.onSubmit ({
                        name: 'may'
                    });
                }
            } 
        }
        // Lặp qua mỗi rule và xử lý 
        options.rules.forEach(function (rule) {
            var inputElement = formElement.querySelector(rule.selector);
            // var errorElement = inputElement.parentElement.querySelector('.form-message');
            if (inputElement) {
                // Xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }

                // Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });
    }
    
}

//Định nghĩa rules
Validator.isRequired = function (selector) {
    return {
        selector : selector,
        test: function (value) {
            return value.trim() ? undefined : 'Vui lòng nhập trường này'
        }
    };
}

Validator.isEmail = function (selector) {
    return {
        selector : selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Trường này phải là email'
            
        }
    };
} 

Validator.minLength = function (selector, min) {
    return {
        selector : selector,
        test: function (value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;           
        }
    };
} 

Validator.isConfirmed = function (selector, getConfirmValue) {
    return {
        selector : selector,
        test: function (value) { 
            return value === getConfirmValue () ?  undefined : 'Giá trị nhập vào không chính xác';
        }
    }
}
