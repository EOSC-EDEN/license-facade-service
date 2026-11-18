function mountAsciinemaPlayers() {
  document.querySelectorAll("[data-asciinema-cast]").forEach((container) => {
    if (container.dataset.asciinemaMounted === "true") {
      return;
    }

    container.dataset.asciinemaMounted = "true";
    AsciinemaPlayer.create(container.dataset.asciinemaCast, container, {
      idleTimeLimit: 1.5,
      poster: "npt:0:01",
      preload: true,
      speed: 1.2,
      theme: "asciinema",
    });
  });
}

if (typeof document$ !== "undefined") {
  document$.subscribe(mountAsciinemaPlayers);
} else if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountAsciinemaPlayers);
} else {
  mountAsciinemaPlayers();
}
