(function init() {
  //@ts-ignore
  const scriptName = (GM_info as GMInfo).script.name;
  //@ts-ignore
  const scriptVersion = GM_info.script.version;

  function displayConsoleColoredMessage(message: string, color: string) {
    return console.info(`%c${scriptName} :%c ${message}`, `color: ${color}; font-weight:bold;`, "color: ''",);
  }

  const currentSearchQuery = new URL(location.href).searchParams.get("q");
  const mapsSearchUrl = `/maps/search/${currentSearchQuery}`;

  const mapsButtonTitleElement = document.createElement("span");
  mapsButtonTitleElement.classList.add("R1QWuf");
  mapsButtonTitleElement.innerText = "Maps";

  const mapsButtonTitleWrapper = document.createElement("div");
  mapsButtonTitleWrapper.classList.add("mXwfNd");
  mapsButtonTitleWrapper.append(mapsButtonTitleElement);

  const mapsLinkElement = document.createElement("a");
  mapsLinkElement.href = mapsSearchUrl;
  mapsLinkElement.classList.add("C6AK7c");
  mapsLinkElement.append(mapsButtonTitleWrapper);

  const mapsButtonWrapper = document.createElement("div");
  mapsButtonWrapper.setAttribute("role", "listitem");
  mapsButtonWrapper.append(mapsLinkElement);

  const googleButtonsContainer = document.querySelector("[role='list']") as HTMLDivElement;
  googleButtonsContainer.insertBefore(mapsButtonWrapper, googleButtonsContainer.children[1]);

  displayConsoleColoredMessage(`Script loaded (v${scriptVersion})`, "#db8d45");
})();
