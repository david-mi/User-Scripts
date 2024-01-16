
(async function handler() {
  async function getMarkMovieAsWatchedParentElement() {
    // await wait(100)
    const MAX_TRIES = 10
    let counter = 0
    let markMovieAsWatchedButton = null

    while (markMovieAsWatchedButton === null && counter <= MAX_TRIES) {
      counter++
      markMovieAsWatchedButton = await new Promise<HTMLDivElement | null>((resolve) => {
        setTimeout(() => {
          const actionButtons = document.querySelectorAll<HTMLDivElement>("[type='actionButton']")
          resolve(actionButtons[1] || null);
        }, 200);
      });
    }

    if (markMovieAsWatchedButton === null) {
      throw new Error("Mark movie as watched button not found !")
    }

    // child gets mutations in some cases so its better to refer on parent element
    return markMovieAsWatchedButton.parentElement!
  }

  function getMovieId() {
    const pageHref = location.href
    const movieIdRegex = /\d+$/
    const movieIdMatch = pageHref.match(movieIdRegex)

    if (movieIdMatch === null) {
      throw new Error("Movie id not found !")
    }

    return movieIdMatch[0]
  }

  function getAuthCookie() {
    const cookie = document.cookie
    const cookieRegex = /(?<=SC_AUTH=)[^\s]+/
    const authCookieMatch = cookie.match(cookieRegex)

    if (authCookieMatch === null) {
      throw new Error("Auth cookie not found !")
    }

    return authCookieMatch[0]
  }

  function hasChangedPage(previousPagePathname: string) {
    return previousPagePathname !== location.pathname
  }

  function isOnAMoviePage() {
    const moviePathRegex = /\/film\/.+\/\d+$/
    return moviePathRegex.test(location.pathname)
  }

  async function wait(time: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, time)
    })
  }

  async function removeMovieFromWishList() {
    const body = `[{ 
      "operationName": "ProductUnwish", 
      "variables": {"productId": ${getMovieId()}}, 
      "query": "mutation ProductUnwish($productId: Int!) {\\n  productUnwish(productId: $productId)\\n}\\n" 
    }]`;

    fetch("https://apollo.senscritique.com/", {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: {
        "accept": "*/*",
        "authorization": getAuthCookie(),
        "content-type": "application/json",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
      body
    });
  }

  async function handleMarkMovieAsWatchedButtonClick() {
    const waitTimeInMs = 200
    await wait(waitTimeInMs)
    removeMovieFromWishList()
  }

  try {
    let markMovieAsWatchedButton = (await getMarkMovieAsWatchedParentElement()).firstElementChild!
    markMovieAsWatchedButton.addEventListener("click", handleMarkMovieAsWatchedButtonClick)

    let previousPagePathname = location.pathname

    const mutationObserver = new MutationObserver(async () => {
      if (hasChangedPage(previousPagePathname)) {
        previousPagePathname = location.pathname
        markMovieAsWatchedButton.removeEventListener("click", handleMarkMovieAsWatchedButtonClick)

        if (isOnAMoviePage()) {
          markMovieAsWatchedButton = (await getMarkMovieAsWatchedParentElement()).firstElementChild!
          console.log("movie page", markMovieAsWatchedButton)
          markMovieAsWatchedButton.addEventListener("click", handleMarkMovieAsWatchedButtonClick)
        }
      }
    })

    mutationObserver.observe(document, { subtree: true, childList: true })
  } catch (error) {
    console.error({ sensCritiqueCustomScriptError: (error as Error).message })
  }
})();