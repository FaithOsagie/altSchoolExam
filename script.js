// Get calculator elements
const display = document.querySelector('.display');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalButton = document.querySelector('.equal-operator');
const decimalButton = document.querySelector('.decimal');
const backspaceButton = document.querySelector('.backspace');

// Calculator state
let currentInput = '';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

// Initialize display
display.textContent = '0';

// Number button handlers
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (shouldResetDisplay) {
            currentInput = '';
            shouldResetDisplay = false;
        }
        
        const number = button.textContent;
        currentInput += number;
        updateDisplay(currentInput);
    });
});

// Decimal button handler
decimalButton.addEventListener('click', () => {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    // Prevent multiple decimals
    if (!currentInput.includes('.')) {
        currentInput += currentInput === '' ? '0.' : '.';
        updateDisplay(currentInput);
    }
});

// Operator button handlers
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedOperator = button.textContent;
        
        // Clear button
        if (selectedOperator === 'C') {
            clear();
            return;
        }
        
        // Percentage button - special handling
        if (selectedOperator === '%') {
            handlePercentage();
            return;
        }
        
        // If there's a previous calculation pending, calculate it first
        if (currentInput !== '' && previousInput !== '' && operator !== null) {
            calculate();
        }
        
        // Set up for next operation
        if (currentInput !== '') {
            previousInput = currentInput;
            currentInput = '';
            operator = selectedOperator;
            shouldResetDisplay = false;
        }
    });
});

// Equal button handler
equalButton.addEventListener('click', () => {
    calculate();
    operator = null;
});

// Backspace button handler
backspaceButton.addEventListener('click', () => {
    if (shouldResetDisplay) {
        return;
    }
    
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput || '0');
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        const button = Array.from(numberButtons).find(btn => btn.textContent === e.key);
        if (button) button.click();
    } else if (e.key === '.') {
        decimalButton.click();
    } else if (e.key === '+' || e.key === '-') {
        const button = Array.from(operatorButtons).find(btn => btn.textContent === e.key);
        if (button) button.click();
    } else if (e.key === '*') {
        const button = Array.from(operatorButtons).find(btn => btn.textContent === 'x');
        if (button) button.click();
    } else if (e.key === '/') {
        e.preventDefault();
        const button = Array.from(operatorButtons).find(btn => btn.textContent === '÷');
        if (button) button.click();
    } else if (e.key === 'Enter' || e.key === '=') {
        equalButton.click();
    } else if (e.key === 'Backspace') {
        backspaceButton.click();
    } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        const button = Array.from(operatorButtons).find(btn => btn.textContent === 'C');
        if (button) button.click();
    } else if (e.key === '%') {
        const button = Array.from(operatorButtons).find(btn => btn.textContent === '%');
        if (button) button.click();
    } else if (e.key === '^') {
        const button = Array.from(operatorButtons).find(btn => btn.textContent === '^');
        if (button) button.click();
    }
});

// Handle percentage like a real calculator
function handlePercentage() {
    if (currentInput === '') return;
    
    const current = parseFloat(currentInput);
    let percentage;
    
    // If there's an operator and previous value, calculate percentage of previous value
    if (operator && previousInput !== '') {
        const prev = parseFloat(previousInput);
        
        switch (operator) {
            case '+':
            case '-':
                // For addition/subtraction: convert to percentage of previous number
                // e.g., 200 + 10% = 200 + 20 = 220
                percentage = prev * current / 100;
                break;
            case 'x':
            case '÷':
            case '^':
                // For multiplication/division/power: just convert to decimal
                // e.g., 50 x 500% = 50 x 5 = 250
                percentage = current / 100;
                break;
            default:
                // For other operators, just convert to decimal
                percentage = current / 100;
        }
        
        // Set the percentage as current input and calculate immediately
        currentInput = percentage.toString();
        calculate();
        return;
    } else {
        // No operator: just convert to decimal (divide by 100)
        // e.g., 50% = 0.5
        percentage = current / 100;
        currentInput = percentage.toString();
        updateDisplay(currentInput);
        shouldResetDisplay = true;
    }
}

// Calculate function
function calculate() {
    if (previousInput === '' || currentInput === '' || operator === null) {
        return;
    }
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case 'x':
            result = prev * current;
            break;
        case '÷':
            if (current === 0) {
                alert('Cannot divide by zero');
                clear();
                return;
            }
            result = prev / current;
            break;
        case '^':
            result = Math.pow(prev, current);
            break;
        default:
            return;
    }
    
    // Round to avoid floating point errors
    result = Math.round(result * 100000000) / 100000000;
    
    currentInput = result.toString();
    previousInput = '';
    operator = null;
    shouldResetDisplay = true;
    updateDisplay(currentInput);
}

// Clear function
function clear() {
    currentInput = '';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay('0');
}

// Update display function
function updateDisplay(value) {
    // Limit display length to prevent overflow
    const displayValue = value.length > 15 ? value.slice(0, 15) : value;
    display.textContent = displayValue || '0';
}