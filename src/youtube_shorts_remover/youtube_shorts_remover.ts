(async function () {
  console.log("youtube_remove_shorts_v0.1")
  let videosContainers: HTMLDivElement[] = []
  let videosContainersWithoutShorts: HTMLDivElement[] = []

  async function getVideosContainers() {
    let newVideosContainers = Array.from<HTMLDivElement>(document.querySelectorAll("ytd-rich-item-renderer"))
    let tries = 0
    const MAX_TRIES = 10

    while (newVideosContainers.length === videosContainersWithoutShorts.length && tries < MAX_TRIES) {
      newVideosContainers = await new Promise<HTMLDivElement[]>((resolve) => {
        setTimeout(() => {
          tries += 1
          resolve(Array.from(document.querySelectorAll("ytd-rich-item-renderer")))
        }, 500);
      });
    }
    return newVideosContainers
  }

  function removeShortsContainersFromDom() {
    for (const videoContainer of videosContainers) {
      const isContainingShort = videoContainer.querySelector("a[href^='/shorts'") !== null

      if (isContainingShort) {
        videoContainer.remove()
      }
    }
  }

  videosContainers = await getVideosContainers()
  removeShortsContainersFromDom()
  videosContainersWithoutShorts = Array.from<HTMLDivElement>(document.querySelectorAll("ytd-rich-item-renderer"))

  let loaderElement = document.getElementById("spinner")!

  let loaderObserver = new IntersectionObserver(async ([entry]) => {
    if (entry.isIntersecting === false) return

    videosContainers = await getVideosContainers()
    removeShortsContainersFromDom()
    videosContainersWithoutShorts = Array.from<HTMLDivElement>(document.querySelectorAll("ytd-rich-item-renderer"))
    loaderObserver.unobserve(loaderElement)
    loaderElement = document.getElementById("spinner")!
    loaderObserver.observe(loaderElement)
  })

  loaderObserver.observe(loaderElement)
})()


