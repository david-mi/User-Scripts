
(async function handler() {
  async function getMarkMovieAsWatchedButton() {
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

    return markMovieAsWatchedButton
  }

  const markMovieAsWatchedButton = await getMarkMovieAsWatchedButton()
  console.log(markMovieAsWatchedButton)

  if (markMovieAsWatchedButton === null) {
    return console.log("Le bouton 'Vu' n'a pas été trouvé")
  }

  async function handleClick() {
    const authCookie = getAuthCookie()
    if (authCookie === null) {
      return console.log("cookie d'authentification non trouvé")
    }

    const movieId = getMovieId()
    if (movieId === null) {
      return console.log("L'id du film n'a pas été trouvé")
    }

    await wait(200)
    removeMovieFromWishList(movieId, authCookie)
  }

  function getMovieId() {
    const pageHref = location.href
    const movieIdRegex = /\d+$/
    const authCookieMatch = pageHref.match(movieIdRegex)
    return authCookieMatch && authCookieMatch[0]
  }

  async function wait(time: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, time)
    })
  }

  async function removeMovieFromWishList(movieId: string, authCookie: string) {
    const body = `[{ 
      "operationName": "ProductUnwish", 
      "variables": {"productId": ${movieId}}, 
      "query": "mutation ProductUnwish($productId: Int!) {\\n  productUnwish(productId: $productId)\\n}\\n" 
    }]`;

    fetch("https://apollo.senscritique.com/", {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: {
        "accept": "*/*",
        "authorization": `${authCookie}`,
        "content-type": "application/json",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
      body: `${body}`,
    });

  }

  function getAuthCookie() {
    const cookie = document.cookie

    const regex = /(?<=SC_AUTH=)[^\s]+/
    const authCookieMatch = cookie.match(regex)
    return authCookieMatch && authCookieMatch[0]
  }

  markMovieAsWatchedButton.addEventListener("click", handleClick)

  let previousPathname = location.pathname

  const mutationObserver = new MutationObserver(() => {
    if (previousPathname !== location.pathname) {
      previousPathname = location.pathname
      console.log("new path page")
      markMovieAsWatchedButton.removeEventListener("click", handleClick)

      const moviePathRegex = /\/film\/.+\/\d+$/
      const isOnAMoviePage = moviePathRegex.test(location.pathname)
      if (isOnAMoviePage === false) return

      console.log("movie page")
      mutationObserver.disconnect()
      handler()
    }
  })

  mutationObserver.observe(document, { subtree: true, childList: true })
})();