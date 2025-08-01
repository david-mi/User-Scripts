"use strict";
(async function init() {
    //@ts-ignore
    const scriptName = GM_info.script.name;
    //@ts-ignore
    const scriptVersion = GM_info.script.version;
    function displayConsoleColoredMessage(message, color) {
        return console.info(`%c${scriptName} :%c ${message}`, `color: ${color}; font-weight:bold;`, "color: ''");
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const nutrientTable = document.querySelector("table");
    const nutrientTableHeaderRow = nutrientTable.querySelector("thead tr");
    const nutrientTableBodyRows = nutrientTable.querySelectorAll("tbody tr");
    function createNutriCalcInput() {
        const nutriCalcInput = document.createElement("input");
        nutriCalcInput.type = "number";
        nutriCalcInput.min = "0";
        nutriCalcInput.max = "10000";
        nutriCalcInput.step = "0.01";
        nutriCalcInput.placeholder = "(g/ml)";
        nutriCalcInput.style.marginBottom = "0";
        nutriCalcInput.style.width = "100%";
        nutriCalcInput.style.maxWidth = "80px";
        nutriCalcInput.addEventListener("input", nutriCalcInputHandler);
        return nutriCalcInput;
    }
    function nutriCalcInputHandler({ target }) {
        const inputElement = target;
        const quantityValueAsNumber = Number(inputElement.value);
        nutrientTableBodyRows.forEach((row, index) => {
            let nutriCalcCell = row.querySelector(`#nutriCalcCell-${index}`);
            const nutrientCell = row.querySelectorAll("td")[1];
            const { baseValue, unit } = getNutrientBaseValueAndUnit(nutrientCell);
            const customNutrientValue = calcCustomNutrientValue(quantityValueAsNumber, formatBaseValue(baseValue));
            let textToAdd = nutrientCell.innerText;
            if (nutriCalcCell === null) {
                nutriCalcCell = document.createElement("td");
                nutriCalcCell.id = `nutriCalcCell-${index}`;
                row.append(nutriCalcCell);
            }
            if (unit !== "%") {
                textToAdd = `${formatNutrientValue(customNutrientValue)} ${unit}`;
            }
            nutriCalcCell.innerText = textToAdd;
        });
    }
    function getNutrientBaseValueAndUnit(nutrientCell) {
        const regex = /(?:\d*\s*\d*\s*kj\n)?\(?(\d(?:,|\.)?\d*)\s*([a-zA-Z%]*)/;
        const [_, baseValue, unit = ""] = nutrientCell.innerText.match(regex);
        return { baseValue, unit };
    }
    function formatBaseValue(baseValue) {
        return Number(baseValue.replace(",", "."));
    }
    function calcCustomNutrientValue(quantity, nutrientBaseValue) {
        return quantity * nutrientBaseValue / 100;
    }
    function formatNutrientValue(nutrientValue) {
        return String(Number(nutrientValue.toFixed(2)));
    }
    function createNutriCalcColumnHeader() {
        const nutriCalcColumnHeader = document.createElement("th");
        const nutriCalcInput = createNutriCalcInput();
        nutriCalcColumnHeader.append(nutriCalcInput);
        return nutriCalcColumnHeader;
    }
    nutrientTableHeaderRow.append(createNutriCalcColumnHeader());
    displayConsoleColoredMessage(`Script loaded (v${scriptVersion})`, "#db8d45");
})();
