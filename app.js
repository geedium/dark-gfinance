const images = [
  chrome.runtime.getURL("img/landingpage4.svg"),
  chrome.runtime.getURL("img/googlelogo_dark_color_74x24dp.png"),
];

const css = `
  .ml2Uge {
    background-image: url("${images[0]}") !important;
  }
`;

const style = document.createElement("style");
style.textContent = css;
document.documentElement.prepend(style);

function replaceLogo() {
  const img = document.querySelector(
    'img[src*="ssl.gstatic.com/images/branding/googlelogo"]'
  );

  if (!img) return;

  if (img && img.src !== images[1]) {
    img.src = images[1];
    img.srcset = "";
  }
}

if (!replaceLogo()) {
  const observer = new MutationObserver(() => {
    replaceLogo();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}
