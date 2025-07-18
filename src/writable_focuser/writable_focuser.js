"use strict";
(async function handler() {
    //@ts-ignore
    const scriptName = GM_info.script.name;
    //@ts-ignore
    const scriptVersion = GM_info.script.version;
    function displayConsoleColoredMessage(message, color) {
        return console.info(`%c${scriptName} :%c ${message}`, `color: ${color}; font-weight:bold;`, "color: ''");
    }
    function isWritableElement(element) {
        return (element instanceof HTMLInputElement ||
            element instanceof HTMLTextAreaElement);
    }
    function isFocusableElement(element) {
        const elementStyle = window.getComputedStyle(element);
        return (element.tabIndex >= 0 &&
            element.disabled === false &&
            elementStyle.display !== "none" &&
            elementStyle.visibility !== "hidden" &&
            elementStyle.opacity !== "0");
    }
    function getFirstFocusableWritableElement(node) {
        if (node === null || node instanceof Element === false)
            return null;
        if (isWritableElement(node) &&
            isFocusableElement(node)) {
            return node;
        }
        if (node.shadowRoot) {
            const foundElement = getFirstFocusableWritableElement(node.shadowRoot);
            if (foundElement)
                return foundElement;
        }
        for (const childNode of node.childNodes) {
            const foundElement = getFirstFocusableWritableElement(childNode);
            if (foundElement)
                return foundElement;
        }
        return null;
    }
    function handleShortcutFocusInput(event) {
        const isMac = navigator.userAgent.includes("Mac");
        const hasMainKeyPressed = isMac
            ? event.metaKey
            : event.ctrlKey;
        const isUsingFocusShortcut = (event.altKey &&
            event.key.toLowerCase() === "k" &&
            hasMainKeyPressed);
        if (isUsingFocusShortcut && isWritableElement(document.activeElement) === false) {
            event.preventDefault();
            getFirstFocusableWritableElement(document.documentElement)?.focus();
        }
        ;
    }
    document.addEventListener("keydown", handleShortcutFocusInput);
    displayConsoleColoredMessage(`Script loaded (v${scriptVersion})`, "#db8d45");
})();
