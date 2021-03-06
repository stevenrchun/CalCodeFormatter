const BUTTON_ID = 'activateButton';
const BUTTON_OFF_CLASS = 'button-off';
const BUTTON_ON_CLASS = 'button-on';

console.log('popup js loaded baby');

function setButtonActiveStatus(button: HTMLElement, active: boolean) {
  if (active) {
    button.className = BUTTON_ON_CLASS;
    button.textContent = 'on';
  } else {
    button.className = BUTTON_OFF_CLASS;
    button.textContent = 'off';
  }
}

let button_or_null: HTMLElement | null = document.getElementById(BUTTON_ID);
let button: HTMLElement;

if (!button_or_null) {
  console.error(
    "Something has gone wrong with CalCodeFormatter. It can't find the button to turn it on.",
  );
  throw "Can't find button element.";
} else {
  // Narrow the type to a non-nullable element.
  button = button_or_null;
}

// Set current status in button.
// Default to on.
chrome.storage.local.get({ active: true }, ({ active }) => {
  setButtonActiveStatus(button, active);
  chrome.storage.local.set({ active });
});

button.addEventListener('click', async () => {
  // The current chrome api supports promises, but the firefox version of
  // the chrome api only does callbacks, so to make the codebase work across
  // both we can't use async/await.
  chrome.storage.local.get('active', ({ active }) => {
    let current_status = active;
    // Set inverted.
    chrome.storage.local.set({ active: !current_status });
    setButtonActiveStatus(button, !current_status);
  });
});
