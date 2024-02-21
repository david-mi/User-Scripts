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
    async function getAutoModeratorPostElements() {
        const MAX_TRIES = 10;
        let counter = 0;
        let autoModeratorPostElements = document.querySelectorAll("shreddit-comment[author='AutoModerator']");
        while (autoModeratorPostElements.length === 0 && counter <= MAX_TRIES) {
            counter++;
            autoModeratorPostElements = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(document.querySelectorAll("shreddit-comment[author='AutoModerator']"));
                }, 200);
            });
        }
        return autoModeratorPostElements.length > 0
            ? Array.from(autoModeratorPostElements)
            : Promise.reject();
    }
    async function hideAutoModeratorPostElements() {
        try {
            const autoModeratorPostElements = await getAutoModeratorPostElements();
            autoModeratorPostElements.forEach((autoModeratorPostElement) => autoModeratorPostElement.remove());
            displayConsoleColoredMessage(`${autoModeratorPostElements.length} AutoModerator post(s) removed`, "#db8d45");
        }
        catch (error) {
            displayConsoleColoredMessage("No AutoModerator post found", "#db8d45");
        }
    }
    hideAutoModeratorPostElements();
    function handleRouteChange() {
        window.removeEventListener("popstate", handleRouteChange);
        init();
    }
    window.addEventListener("popstate", handleRouteChange);
})();
