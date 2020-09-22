class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement, output) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.outputField = output;
        this.clear();
        this.reset = false;
        this.sqrt = false;

    }

    clear() {
        this.currentOperand = "";
        this.previousOperand = "";
        this.operation = undefined;
    }

    showError() {
        // color = "#e03737";
        this.outputField.style.borderColor = "#e03737";
        setTimeout(
            () => (this.outputField.style.borderColor = "#000000"),
            3000
        );
    }
    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (this.currentOperand.length > 6) {
            return;
        }
        if (this.reset && this.previousOperand === "") {
            this.clear();
            this.reset = false;
        }

        if (this.reset && (!(this.previousOperand === ""))) {
            //case when we need to compute in-place and new number triggers computation with previous number: 1 + sqrt(4) + 9
            this.currentOperand =
                this.currentOperand.toString() + number.toString();
            this.compute();
            this.previousOperand = this.currentOperand;
        }


        this.reset = false;
        if (number === "." && this.currentOperand.includes(".")) return;
        this.currentOperand =
            this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        // if (this.currentOperand === "") return;

        if (this.previousOperand !== "") {
            this.compute();
        } else {
            this.reset = false;
        }

        this.operation = operation;
        if (this.currentOperand === "") {
            return;
        }
        this.previousOperand = this.currentOperand;
        this.currentOperand = "";
    }

    sqrt() {
        if (this.currentOperand === "") {
            return;
        }
        this.currentOperand = Math.sqrt(this.currentOperand);
        this.reset = true;
        this.sqrt = true;

    }

    compute() {
        let computation;
        let prev = parseFloat(this.previousOperand);
        let current = parseFloat(this.currentOperand);
        // if (isNaN(prev)) {
        //     return
        // }
        if (isNaN(current)) {
            return;
        }
        switch (this.operation) {
            case "+":
                computation = prev + current;
                break;
            case "-":
                computation = prev - current;
                break;
            case "*":
                computation = prev * current;
                break;

            case "POW":
                computation = Math.pow(prev, current);
                break;

            // case "sqrt":
            // computation = Math.sqrt(prev);
            // break;

            case "÷":
                computation = prev / current;
                if (!isFinite(computation)) {
                    computation = "Error";
                }
                break;
            default:
                return;
        }

        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = "";
        this.reset = false;

    }

    equal() {

        if (this.currentOperand !== "") {
            this.compute()
            this.reset = true;}
        
    }

    getDisplayNumber(number) {
        if (number === "Error") {
            this.clear();
            this.showError();
            // return;
        }

        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split(".")[0]);
        const decimalDigits = stringNumber.split(".")[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            //to display floats in '0.123' format
            integerDisplay = "";
        } else {
            integerDisplay = integerDigits.toLocaleString("en", {
                maximumFractionDigits: 0,
            });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(
            this.currentOperand
        );
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(
                this.previousOperand
            )} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = "";
        }
    }
}

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const previousOperandTextElement = document.querySelector(
    "[data-previous-operand]"
);
const currentOperandTextElement = document.querySelector(
    "[data-current-operand]"
);
const output = document.querySelector(".output");
const sqrtButton = document.querySelector("[data-sqrt]");

const calculator = new Calculator(
    previousOperandTextElement,
    currentOperandTextElement,
    output
);

numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach((button) => {
    button.addEventListener("click", () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener("click", (button) => {
    calculator.equal();
    calculator.updateDisplay();
});

allClearButton.addEventListener("click", (button) => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener("click", (button) => {
    calculator.delete();
    calculator.updateDisplay();
});

sqrtButton.addEventListener("click", (e) => {
    // console.log(button.innerText);
    calculator.sqrt();
    calculator.updateDisplay();
});
