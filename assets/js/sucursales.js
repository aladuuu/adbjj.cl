(function () {
  "use strict";

  const branchHashes = new Set([
    "#sucursal-las-condes",
    "#sucursal-penalolen",
  ]);

  const getTargetFromHash = () => {
    const hash = decodeURIComponent(window.location.hash || "");
    if (!branchHashes.has(hash)) return null;
    return document.querySelector(hash);
  };

  const getHeaderOffset = () => {
    const header = document.querySelector("#header");
    if (!header) return 80;
    return Math.ceil(header.getBoundingClientRect().height) + 80;
  };

  const alignTargetUnderHeader = (behavior) => {
    const target = getTargetFromHash();
    if (!target) return;

    const absoluteTop = window.pageYOffset + target.getBoundingClientRect().top;
    const scrollTop = Math.max(absoluteTop - getHeaderOffset(), 0);

    window.scrollTo({
      top: scrollTop,
      behavior,
    });
  };

  const syncInitialAnchor = () => {
    alignTargetUnderHeader("auto");
    window.requestAnimationFrame(() => alignTargetUnderHeader("auto"));
    window.setTimeout(() => alignTargetUnderHeader("auto"), 140);
    window.setTimeout(() => alignTargetUnderHeader("auto"), 320);
  };

  window.addEventListener("load", syncInitialAnchor);
  window.addEventListener("hashchange", () => alignTargetUnderHeader("smooth"));
})();
