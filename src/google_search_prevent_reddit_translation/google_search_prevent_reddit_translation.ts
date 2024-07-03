(function init() {
  //@ts-ignore
  const scriptName = GM_info.script.name
  //@ts-ignore
  const scriptVersion = GM_info.script.version

  function displayConsoleColoredMessage(message: string, color: string) {
    return console.info(`%c${scriptName} :%c ${message}`, `color: ${color}; font-weight:bold;`, "color: ''",)
  }

  function getClickedLink(eventTarget: EventTarget | null) {
    return eventTarget instanceof HTMLElement
      ? eventTarget.tagName === "A"
        ? eventTarget as HTMLAnchorElement
        : eventTarget.closest("a")
      : null
  }

  function isRedditTranslatedLink(destinationLink: string) {
    const redditTranslatedLinkRegex = /https:\/\/www\.reddit\.com\/r\/.*\/(fr\/|\?tl=fr)/
    return redditTranslatedLinkRegex.test(destinationLink)
  }

  function handleClick(event: MouseEvent) {
    const clickedLink = getClickedLink(event.target)
    if (clickedLink === null) return

    const destinationUrl = clickedLink.href

    if (isRedditTranslatedLink(destinationUrl)) {
      event.preventDefault()
      const newUrl = destinationUrl.replace(/(fr\/|\?tl=fr)/, "")
      location.assign(newUrl)
    }
  }

  document.addEventListener("click", handleClick, true)

  displayConsoleColoredMessage(`Script loaded (v${scriptVersion})`, "#db8d45")
})();