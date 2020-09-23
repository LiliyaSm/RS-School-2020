class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement, output) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.outputField = output;
        this.clear();
        this.reset = false;
    }
    static get MAXVALUE() {
        return 99999999999;
    }
    static get MINVALUE() {
        return -99999999999;
    }

    clear() {
        this.currentOperand = "";
        this.previousOperand = "";
        this.operation = undefined;
    }

    showError(message) {
        if (message === "Error") {
            this.currentOperandTextElement.style.color = "#e03737";
            document.body.style.background = "#535353";
            document
                .querySelectorAll("span")
                .forEach((el) => (el.style.opacity = "1"));
        }
        this.outputField.style.borderColor = "#e03737";
        this.clear();
        this.currentOperandTextElement.innerText = message;
        this.previousOperandTextElement.innerText = "";
        setTimeout(() => {
            this.outputField.style.borderColor = "#000000";
            this.currentOperandTextElement.innerText = "";
            this.currentOperandTextElement.style.color = "white";
            document.body.style.background = null;
            document
                .querySelectorAll("span")
                .forEach((el) => (el.style.opacity = "0"));
        }, 3000);
    }
    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (this.currentOperand.length > 10) {
            return;
        }
        if (number === "." && this.currentOperand.includes(".")) return;

        if (this.reset) {
            this.currentOperand = "";
        }

        this.reset = false;
        this.currentOperand =
            this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === "" && this.previousOperand === "") return;

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
        this.reset = true;
        let computation = Number(Math.sqrt(this.currentOperand).toFixed(10));
        if (isNaN(computation)) {
            computation = "Error";
        }

        this.currentOperand = computation.toString().slice(0, 11);
    }

    compute() {
        let computation;
        let prev = parseFloat(this.previousOperand);
        let current = parseFloat(this.currentOperand);

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

            case "^":
                computation = Math.pow(prev, current);
                if (!isFinite(computation)) {
                    computation = "Number too long!";
                }
                break;

            case "÷":
                computation = prev / current;
                if (!isFinite(computation)) {
                    computation = "Error";
                }
                break;
            default:
                return;
        }

        if (
            parseFloat(computation) > Calculator.MAXVALUE ||
            parseFloat(computation) < Calculator.MINVALUE
        ) {
            computation = "Number too long!";
        }

        if (typeof computation === "number") {
            //toFixed used to fix js precision error and toString to rid of trailing zeros
            let result = Number(computation.toFixed(10));
            this.currentOperand = result.toString().slice(0, 12);
        } else {
            this.currentOperand = computation;
        }
        this.operation = undefined;
        this.previousOperand = "";
        this.reset = false;
    }

    equal() {
        if (this.currentOperand !== "") {
            this.compute();
            this.reset = true;
        }
    }

    switch() {
        if (this.currentOperand === "") return;
        let number = parseFloat(this.currentOperand);
        if (number > 0) {
            this.currentOperand = "-" + this.currentOperand;
        } else if (number < 0) {
            this.currentOperand = this.currentOperand.toString().slice(1);
        }
        return;
    }

    getDisplayNumber(number) {
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
        if (
            this.currentOperand === "Error" ||
            this.currentOperand === "Number too long!"
        ) {
            this.showError(this.currentOperand);
            return;
        }

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
const switchButton = document.querySelector("[data-switch]");

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
    calculator.sqrt();
    calculator.updateDisplay();
});

switchButton.addEventListener("click", (e) => {
    calculator.switch();
    calculator.updateDisplay();
});
