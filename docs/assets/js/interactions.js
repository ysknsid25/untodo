// untodo LP — small interaction helpers.
// Swaps the animated typing logo for the static logo when the user has
// requested reduced motion, since the animated SVG's internal <animate>
// elements aren't covered by the CSS reduced-motion override in style.css.

(function () {
  "use strict";

  function applyMotionPreference() {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const heroLogo = document.querySelector(".hero__logo img");
    if (!heroLogo) return;

    if (prefersReduced) {
      heroLogo.setAttribute("src", "./assets/img/logo.svg");
    } else {
      heroLogo.setAttribute("src", "./assets/img/logo-typing.svg");
    }
  }

  document.addEventListener("DOMContentLoaded", applyMotionPreference);
})();
