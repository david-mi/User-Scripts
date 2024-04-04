(function init() {
  //@ts-ignore
  const scriptName = GM_info.script.name
  //@ts-ignore
  const scriptVersion = GM_info.script.version

  function displayConsoleColoredMessage(message: string, color: string) {
    return console.info(`%c${scriptName} :%c ${message}`, `color: ${color}; font-weight:bold;`, "color: ''",)
  }

  const nutrientTable = document.querySelector("table") as HTMLTableElement;
  const nutrientTableHeaderRow = nutrientTable.querySelector("thead tr") as HTMLTableRowElement;
  const nutrientTableBodyRows = nutrientTable.querySelectorAll("tbody tr") as NodeListOf<HTMLTableRowElement>;

  function createQuantityCalcInput() {
    const quantityCalcInput = document.createElement("input");
    quantityCalcInput.type = "number";
    quantityCalcInput.min = "0";
    quantityCalcInput.step = "0.01";
    quantityCalcInput.placeholder = "Quantity (g)";
    quantityCalcInput.style.marginBottom = "0"
    quantityCalcInput.style.maxWidth = "130px"

    return quantityCalcInput;
  }

  function createQuantityCalcColumnHeader() {
    const quantityCalcColumnHeader = document.createElement("th");
    const quantityCalcInput = createQuantityCalcInput();
    quantityCalcColumnHeader.appendChild(quantityCalcInput);

    return quantityCalcColumnHeader;
  }

  nutrientTableHeaderRow.appendChild(createQuantityCalcColumnHeader());

  displayConsoleColoredMessage(`Script loaded (v${scriptVersion})`, "#db8d45")
})();