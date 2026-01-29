// Get the display element from HTML
const display = document.querySelector('.display');

// Variables to store what the calculator is doing
let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

// Maximum number of characters allowed in display
const MAX_DISPLAY_LENGTH = 12;

// Show "0" when calculator first loads
display.textContent = currentInput;

// Get all the buttons from HTML
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalButton = document.querySelector('.equal-operator');
const decimalButton = document.querySelector('.decimal');
const backspaceButton = document.querySelector('.backspace');

// Add click listeners to all number buttons (0-9)
numberButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const number = button.textContent;
        handleNumber(number);
    });
});

// Add click listeners to all operator buttons (+, -, ×, ÷, etc)
operatorButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const op = button.textContent;
        handleOperator(op);
    });
});

// Add click listener to equals button
equalButton.addEventListener('click', function() {
    handleEqual();
});

// Add click listener to decimal point button
decimalButton.addEventListener('click', function() {
    handleDecimal();
});

// Add click listener to backspace button
backspaceButton.addEventListener('click', function() {
    handleBackspace();
});

// Function to handle when a number button is pressed
function handleNumber(number) {
    // If we just finished a calculation, start fresh with new number
    if (shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else {
        // If display shows "0", replace it with the new number
        if (currentInput === '0') {
            currentInput = number;
        } else {
            // Check if we have space for more digits
            if (currentInput.length >= MAX_DISPLAY_LENGTH) {
                return; // Stop if display is full
            }
            // Add the new number to what's already there
            currentInput = currentInput + number;
        }
    }
    updateDisplay();
}

// Function to handle when an operator button is pressed (+, -, ×, ÷, etc)
function handleOperator(op) {
    // If user pressed C button, clear everything
    if (op === 'C') {
        clear();
        return;
    }

    // If there's already an operator and user didn't just press equals,
    // calculate the result first before applying new operator
    if (operator !== null && shouldResetDisplay === false) {
        calculate();
    }

    // Save the current number as the previous number
    previousInput = currentInput;
    
    // Convert the display operator symbols to calculation operators
    if (op === 'x' || op === '×') {
        operator = '*';
    } else if (op === '÷') {
        operator = '/';
    } else {
        operator = op;
    }
    
    // Next number typed should replace the display
    shouldResetDisplay = true;
}

// Function to handle when equals button is pressed
function handleEqual() {
    // Only calculate if we have an operator and a previous number
    if (operator === null || shouldResetDisplay === true) {
        return;
    }
    calculate();
    operator = null;
}

// Function to handle when decimal point button is pressed
function handleDecimal() {
    // If we just finished a calculation, start fresh with "0."
    if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
    } else {
        // Only add decimal if there isn't one already
        const hasDecimal = currentInput.includes('.');
        const hasSpace = currentInput.length < MAX_DISPLAY_LENGTH;
        
        if (hasDecimal === false && hasSpace === true) {
            currentInput = currentInput + '.';
        }
    }
    updateDisplay();
}

// Function to handle when backspace button is pressed
function handleBackspace() {
    // If we just got a result from calculation, clear everything
    if (shouldResetDisplay === true) {
        clear();
        return;
    }
    
    // If there's more than one character, remove the last one
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        // If only one character left, show "0"
        currentInput = '0';
    }
    updateDisplay();
}

// Function to perform the actual calculation
function calculate() {
    // Convert string numbers to actual numbers
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    // Check if conversion worked
    if (isNaN(prev) === true || isNaN(current) === true) {
        currentInput = 'Error';
        previousInput = '';
        operator = null;
        shouldResetDisplay = true;
        updateDisplay();
        return;
    }
    
    let result;
    
    // Perform the calculation based on which operator was pressed
    if (operator === '+') {
        result = prev + current;
    } else if (operator === '-') {
        result = prev - current;
    } else if (operator === '*') {
        result = prev * current;
    } else if (operator === '/') {
        // Check for division by zero
        if (current === 0) {
            currentInput = 'Error';
            previousInput = '';
            operator = null;
            shouldResetDisplay = true;
            updateDisplay();
            return;
        }
        result = prev / current;
    } else if (operator === '%') {
        // Calculate percentage: prev % current means "current percent of prev"
        // For example: 100 % 20 = 20 (which is 20% of 100)
        result = (prev * current) / 100;
    } else if (operator === '^') {
        // Calculate power: prev ^ current means "prev to the power of current"
        result = Math.pow(prev, current);
        
        // Check if result is too big or too small
        if (isFinite(result) === false) {
            currentInput = 'Error';
            previousInput = '';
            operator = null;
            shouldResetDisplay = true;
            updateDisplay();
            return;
        }
    } else {
        return;
    }
    
    // Round the result to avoid floating point errors
    // For example: 0.1 + 0.2 = 0.30000000000000004
    const roundedResult = Math.round(result * 100000000) / 100000000;
    
    // Convert result back to string and update display
    currentInput = String(roundedResult);
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}

// Function to clear the calculator (reset everything)
function clear() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

// Function to update what shows on the display
function updateDisplay() {
    // If current input is "Error", just show it
    if (currentInput === 'Error') {
        display.textContent = currentInput;
        return;
    }
    
    const number = parseFloat(currentInput);
    
    // If number is too long or too big, show in scientific notation
    if (currentInput.length > MAX_DISPLAY_LENGTH || Math.abs(number) > 999999999999) {
        display.textContent = number.toExponential(5);
    } else {
        display.textContent = currentInput;
    }
}

// Add keyboard support so users can type numbers and operators
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Check if user pressed a number key (0-9)
    if (key >= '0' && key <= '9') {
        handleNumber(key);
        return;
    }
    
    // Check if user pressed an operator key
    if (key === '+') {
        handleOperator('+');
        return;
    }
    
    if (key === '-') {
        handleOperator('-');
        return;
    }
    
    if (key === '*' || key === 'x') {
        handleOperator('×');
        return;
    }
    
    if (key === '/') {
        event.preventDefault(); // Stop browser from opening search
        handleOperator('÷');
        return;
    }
    
    if (key === '%') {
        handleOperator('%');
        return;
    }
    
    if (key === '^') {
        handleOperator('^');
        return;
    }
    
    // Check if user pressed decimal point
    if (key === '.') {
        handleDecimal();
        return;
    }
    
    // Check if user pressed Enter or equals sign
    if (key === 'Enter' || key === '=') {
        handleEqual();
        return;
    }
    
    // Check if user pressed Backspace
    if (key === 'Backspace') {
        handleBackspace();
        return;
    }
    
    // Check if user pressed Escape or C to clear
    if (key === 'Escape' || key === 'c' || key === 'C') {
        clear();
        return;
    }
});