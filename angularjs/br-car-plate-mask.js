angular.module('directives')

    .directive('brCarPlateMask', plateMask);

function plateMask($timeout) {

    var ddo = {};

    ddo.restrict = 'A';

    ddo.require = 'ngModel';

    ddo.link = function (scope, element, attrs, ctrl) {

        var input = angular.element(element[0]),
            typedValue = '',
            cleanValue = '',
            plateLimitLength = 8;

        input.on('input', onInput);

        input.on('focus', changeKeyboard);

        element.bind('keydown keypress', onKeyPress);

        function onInput() {

            typedValue = input[0].value || '';

            cleanValue = input[0].value.replace(/\W/g, '') || '';

            // Check the plate pattern and clear the last character if it doesn't match
            if (!isPlatePattern(cleanValue)) {

                setUpperCasedInputValue(typedValue.slice(0, typedValue.length - 1));
                return;
            }

            // Just set uppercase
            setUpperCasedInputValue(input[0].value);

            // If try to set more characters than the limit, remove the last character
            if (typedValue.length > plateLimitLength) {

                setUpperCasedInputValue(typedValue.slice(0, plateLimitLength));
                return;
            }

            if (cleanValue.length === 3 && input[0].type === 'text') {

                setUpperCasedInputValue(cleanValue + '-');

                $timeout(moveCursorToEnd, 1);
            }

            if (cleanValue.length === 4 && input[0].type === 'tel') {

                var stringPrefix = cleanValue.slice(0, 3);

                var stringSuffix = cleanValue.slice(stringPrefix.length);

                setUpperCasedInputValue(stringPrefix + '-' + stringSuffix);

                $timeout(moveCursorToEnd, 1);
            }

            // Set input validation
            ctrl.$validators.pattern = function isPlate(modelValue) {

                if (ctrl.$isEmpty(modelValue)) {

                    return true;
                }

                return /\D{3}-\d{4}/.test(modelValue);
            };
        }

        function onKeyPress(pressEvent) {

            console.log('keypress', cleanValue.length);

            if (pressEvent.keyCode !== 8) { // backspace

                return;
            }

            if (cleanValue.length <= 3) {

                input[0].blur();
                input[0].focus();
            }
        }

        function setUpperCasedInputValue(value) {

            input[0].value = value.toUpperCase();
        }

        function moveCursorToEnd() {

            input[0].setSelectionRange(8, 8);
            input[0].blur();
            input[0].focus();
        }

        function changeKeyboard() {

            console.log('focus', typedValue.length);

            if (input[0].value.length <= 3) {

                input[0].type = 'text';
                return;
            }

            if (input[0].value.length > 3) {

                input[0].type = 'tel';
            }
        }

        function isPlatePattern(cleanValue) {

            if (cleanValue.length === 1 && /\D/.test(cleanValue)) {

                return true;
            }

            if (cleanValue.length === 2 && /\D{2}/.test(cleanValue)) {

                return true;
            }

            if (cleanValue.length === 3 && /\D{3}/.test(cleanValue)) {

                return true;
            }

            if (cleanValue.length === 4 && /\D{3}\d/.test(cleanValue)) {

                return true;
            }

            if (cleanValue.length === 5 && /\D{3}\d{2}/.test(cleanValue)) {

                return true;
            }

            if (cleanValue.length === 6 && /\D{3}\d{3}/.test(cleanValue)) {

                return true;
            }

            if (cleanValue.length === 7 && /\D{3}\d{4}/.test(cleanValue)) {

                return true;
            }
        }
    };

    return ddo;
}