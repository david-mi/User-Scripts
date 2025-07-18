"use strict";
(function init() {
    //@ts-ignore
    const scriptName = GM_info.script.name;
    //@ts-ignore
    const scriptVersion = GM_info.script.version;
    function displayConsoleColoredMessage(message, color) {
        return console.info(`%c${scriptName} :%c ${message}`, `color: ${color}; font-weight:bold;`, "color: ''");
    }
    const currentSearchQuery = new URL(location.href).searchParams.get("q");
    const mapsSearchUrl = `/maps/search/${currentSearchQuery}`;
    const mapsButtonTitleElement = document.createElement("div");
    mapsButtonTitleElement.classList.add("YmvwI");
    mapsButtonTitleElement.innerText = "Maps";
    const mapsLinkElement = document.createElement("a");
    mapsLinkElement.href = mapsSearchUrl;
    mapsLinkElement.classList.add("nPDzT", "T3FoJb");
    mapsLinkElement.append(mapsButtonTitleElement);
    const mapsButtonWrapper = document.createElement("div");
    mapsButtonWrapper.setAttribute("role", "listitem");
    mapsButtonWrapper.append(mapsLinkElement);
    const googleButtonsContainer = document.querySelector(".crJ18e [role='list']");
    googleButtonsContainer.insertBefore(mapsButtonWrapper, googleButtonsContainer.children[1]);
    displayConsoleColoredMessage(`Script loaded (v${scriptVersion})`, "#db8d45");
})();
