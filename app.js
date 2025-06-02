const svgUrl = chrome.runtime.getURL("img/landingpage4.svg");

const css = `
  .ml2Uge {
    background-image: url("${svgUrl}") !important;
  }
`;

const style = document.createElement("style");
style.textContent = css;
document.documentElement.prepend(style);
