
// Đối tượng 'Validator'
function Validator(options) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }


    var selectorRules = {};

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage = rule.test(inputElement.value);

        // console.log(selectorRules);
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
    }

    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        // Khi submit form
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;
            
            //Lặp qua từng rules và validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                validate(inputElement, rule);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            console.log(enableInputs);

            if (isFormValid) {
                // trường hợp submit với javascript
                if (typeof options.onSubmit === 'function') {

                    var enableInputs = formElement.querySelectorAll('[name]');
                    
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        values[input.name] = input.value;
                        return values;
                    }, {});
                    options.onSubmit(formValues);
                }    
                // Trường hợp submit với hành vi mặc định 
                else {
                    formElement.submit();
                }
            }
            
        }

            

            // Lặp qua mỗi  rule và xử lý (lắng nghe sự kiện)
            // options.rules.forEach(function (rule) {

            //     //Lưu lại các rules cho mỗi input
            //     if(Array.isArray(selectorRules[rule.selector])) {
            //         selectorRules[rule.selector].push(rule.test);
            //     } else {
            //         selectorRules[rule.selector] = [rule.test];
            //     }

            //     var inputElement = formElement.querySelector(rule.selector);
            // });

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
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
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
