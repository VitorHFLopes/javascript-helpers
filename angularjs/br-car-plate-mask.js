angular.module('directives')

    .directive('brCarPlateMask', plateMask);

function plateMask() {

    var ddo = {};

    ddo.restrict = 'A';

    ddo.require = 'ngModel';

    ddo.link = function (scope, element, attrs, ctrl) {

        var input = angular.element(element[0]);
        var currentInputValue = '';

        input.on('input', onInput);

        function onInput() {

            var inputRawValue = input[0].value || '';

            var inputValue = input[0].value.replace(/\W/g, '') || '';

            var plateLimitLength = 8;

            if (!isPlatePattern(inputValue)) {

                setUpperCasedInputValue(inputRawValue.slice(0, inputRawValue.length - 1));
                return;
            }

            setUpperCasedInputValue(input[0].value);

            if (inputRawValue.length > plateLimitLength) {

                setUpperCasedInputValue(inputRawValue.slice(0, plateLimitLength));
                return;
            }

            if (inputValue.length > 3) {

                var stringPrefix = inputValue.slice(0, 3);

                var stringSuffix = inputValue.slice(stringPrefix.length);

                setUpperCasedInputValue(stringPrefix + '-' + stringSuffix);
            }

            if (inputRawValue < currentInputValue) {

                var suffix = inputRawValue.slice(3);

                if (suffix === '-') {

                    setUpperCasedInputValue(inputRawValue.slice(0, 3));
                }
            }

            ctrl.$validators.pattern = function isPlate(modelValue) {

                if (ctrl.$isEmpty(modelValue)) {

                    return true;
                }

                return /\D{3}-\d{4}/.test(modelValue);
            };
        }

        function setUpperCasedInputValue(value) {

            input[0].value = value.toUpperCase();

            currentInputValue = input[0].value;
        }

        function isPlatePattern(inputValue) {

            if (inputValue.length === 1 && /\D/.test(inputValue)) {

                return true;
            }

            if (inputValue.length === 2 && /\D{2}/.test(inputValue)) {

                return true;
            }

            if (inputValue.length === 3 && /\D{3}/.test(inputValue)) {

                return true;
            }

            if (inputValue.length === 4 && /\D{3}\d/.test(inputValue)) {

                return true;
            }

            if (inputValue.length === 5 && /\D{3}\d{2}/.test(inputValue)) {

                return true;
            }

            if (inputValue.length === 6 && /\D{3}\d{3}/.test(inputValue)) {

                return true;
            }

            if (inputValue.length === 7 && /\D{3}\d{4}/.test(inputValue)) {

                return true;
            }
        }
    };

    return ddo;
}