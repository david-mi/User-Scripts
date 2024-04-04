"use strict";
(function init() {
    //@ts-ignore
    const scriptName = GM_info.script.name;
    //@ts-ignore
    const scriptVersion = GM_info.script.version;
    function displayConsoleColoredMessage(message, color) {
        return console.info(`%c${scriptName} :%c ${message}`, `color: ${color}; font-weight:bold;`, "color: ''");
    }

    displayConsoleColoredMessage(`Script loaded (v${scriptVersion})`, "#db8d45");
})();
