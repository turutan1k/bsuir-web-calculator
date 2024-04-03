const inputBox = document.getElementById("input")
const expressionDiv = document.getElementById("expression")
const resultDiv = document.getElementById("result")
let expression = ""
let result = ""

const buttonClick = (event) => {
    const target = event.target
    const action = target.dataset.action
    const value = target.dataset.value
    switch (action) {
        case "number":
            addValue(value)
            break
        case "clear":
            clear()
            break
        case "backspace":
            backspace()
            break
        case "addition":
        case "subtraction":
        case "multiplication":
        case "division":
            if (expression === "" && result !== "") {
                startFromResult(value)
            } else if (expression !== "" && !isLastCharOperator()) {
                addValue(value)
            }
            break
        case "submit":
            submit()
            break
        case "negate":
            negate()
            break
        case "mod":
            percentage()
            break
        case "decimal":
            decimal(value)
            break
    }
    updateDisplay(expression, result)
}

inputBox.addEventListener("click", buttonClick)

const addValue = (value) => {
    if (value === ".") {
        const lastOperatorIndex = expression.search(/[+\-*/]/)
        const lastDecimalIndex = expression.lastIndexOf(".")
        const lastNumberIndex = Math.max(
            expression.lastIndexOf("+"),
            expression.lastIndexOf("-"),
            expression.lastIndexOf("*"),
            expression.lastIndexOf("/")
        )
        if (
            (lastDecimalIndex < lastOperatorIndex ||
                lastDecimalIndex < lastNumberIndex ||
                lastDecimalIndex === -1) &&
            (expression === "" ||
                expression.slice(lastNumberIndex + 1).indexOf("-") === -1)
        ) {
            expression += value
        }
    } else {
        expression += value
    }
}

const updateDisplay = (expression, result) => {
    expressionDiv.textContent = expression
    resultDiv.textContent = result
}

const clear = () => {
    expression = ""
    result = ""
}

const backspace = () => {
    expression = expression.slice(0, -1)
}

const isLastCharOperator = () => {
    return isNaN(parseInt(expression.slice(-1)))
}

const startFromResult = (value) => {
    expression += result + value
}

const submit = () => {
    result = evaluateExpression()
    expression = ""
}

const evaluateExpression = () => {
    const evalResult = eval(expression)
    return isNaN(evalResult) || !isFinite(evalResult)
        ? " "
        : evalResult < 1
        ? parseFloat(evalResult.toFixed(10))
        : parseFloat(evalResult.toFixed(2))
}

const negate = () => {
    if (expression === "" && result !== "") {
        result = -result
    } else if (!expression.startsWith("-") && expression !== "") {
        expression = "-" + expression
    } else if (expression.startsWith("-")) {
        expression = expression.slice(1)
    }
}

const percentage = () => {
    if (expression !== "") {
        result = evaluateExpression()
        expression = ""
        if (!isNaN(result) && isFinite(result)) {
            result /= 100
        } else {
            result = ""
        }
    } else if (result !== "") {
        result = parseFloat(result) / 100
    }
}

const decimal = (value) => {
    if (!expression.endsWith(".") && !isNaN(expression.slice(-1))) {
        addValue(value)
    }
}
