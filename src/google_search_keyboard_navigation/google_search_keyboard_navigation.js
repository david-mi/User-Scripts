"use strict";
(function () {
    //@ts-ignore
    const scriptName = GM_info.script.name;
    //@ts-ignore
    const scriptVersion = GM_info.script.version;
    function getLinks() {
        return Array
            .from(document.querySelectorAll("a:has(h3)"))
            .filter((link) => !link.closest(".related-question-pair"));
    }
    function insertFocusStyleInDocument() {
        const styleElement = document.createElement("style");
        document.head.appendChild(styleElement);
        styleElement.sheet.insertRule("div:is(.hlcw0c, .MjjYud):has(a h3):focus-within { outline: black solid 1px !important; outline-offset: 5px;}");
        styleElement.sheet.insertRule("a:has(h3):focus {outline: none!important}");
    }
    function getLinkToFocusIndex(directionKey) {
        const activeElementIndexFromLInks = links.findIndex((link) => link
            .closest(".hlcw0c, .MjjYud")
            ?.contains(document.activeElement));
        linkToFocusIndex = activeElementIndexFromLInks === -1
            ? linkToFocusIndex
            : activeElementIndexFromLInks;
        if (linkToFocusIndex === null) {
            return linkToFocusIndex = 0;
        }
        if (directionKey === "ArrowUp" && linkToFocusIndex > 0) {
            return linkToFocusIndex - 1;
        }
        if (directionKey === "ArrowDown" && linkToFocusIndex < links.length) {
            return linkToFocusIndex + 1;
        }
        return linkToFocusIndex;
    }
    function displayConsoleColoredMessage(message, color) {
        return console.info(`%c${scriptName} :%c ${message}`, `color: ${color}; font-weight:bold;`, "color: #db8d45");
    }
    insertFocusStyleInDocument();
    let links = getLinks();
    let linkToFocusIndex = null;
    document.addEventListener("keydown", function ({ ctrlKey, key }) {
        if (ctrlKey && (key === "ArrowUp" || key === "ArrowDown")) {
            links = getLinks();
            linkToFocusIndex = getLinkToFocusIndex(key);
            links[linkToFocusIndex].focus();
        }
    });
    displayConsoleColoredMessage(`Script loaded (v${scriptVersion})`, "#db8d45");
})();
