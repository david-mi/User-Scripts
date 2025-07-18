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
    const subRedditName = location.href.match(/.*reddit.com\/r\/(\w+)\/?(?:(?:best|hot|new|top|rising|controversial)\/)?$/)?.[1] || null;
    if (!subRedditName)
        return;
    console.log({ subRedditName });
    const filtersContainer = document.querySelector("[slot=dropdown-items]");
    const filtersList = {
        HOT: "hot",
        NEW: "new",
        TOP: "top",
        RISING: "rising",
        CONTROVERSIAL: "controversial",
    };
    const selectedFilterElement = document.querySelector("[slot=selected-item]");
    console.log({ textContent: selectedFilterElement?.textContent });
    if (selectedFilterElement?.textContent === "") {
        selectedFilterElement.textContent = "Controversial";
    }
    console.log({ filtersContainer });
    const controversialFilterHtml = `
  <li rpl="" class="relative list-none mt-0 " role="presentation">
    <a class="flex justify-between relative px-md gap-[0.5rem] text-secondary hover:text-secondary-hover active:bg-interactive-pressed hover:bg-neutral-background-hover hover:no-underline cursor-pointer  py-xs  -outline-offset-1   no-underline" href="/r/${subRedditName}/controversial/" style="padding-right: 16px" tabindex="-1">
      <span class="flex items-center gap-xs min-w-0 shrink">
        <span class="flex flex-col justify-center min-w-0 shrink py-[var(--rem6)]">
          <span class="text-14">Controversial</span>
          <span class="text-12 text-secondary-weak"></span>
        </span>
        </span>
        <span class="flex items-center shrink-0">
        <span class="flex items-center justify-center h-lg"></span>
      </span>
    </a> 
  </li>`;
    filtersContainer.insertAdjacentHTML("beforeend", controversialFilterHtml);
})();
