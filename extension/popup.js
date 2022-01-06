"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BUTTON_ID = 'activateButton';
const BUTTON_OFF_CLASS = 'button-off';
const BUTTON_ON_CLASS = 'button-on';
function setButtonActiveStatus(button, active) {
    if (active) {
        button.className = BUTTON_ON_CLASS;
        button.textContent = 'on';
    }
    else {
        button.className = BUTTON_OFF_CLASS;
        button.textContent = 'off';
    }
}
let button_or_null = document.getElementById(BUTTON_ID);
let button;
if (!button_or_null) {
    console.error("Something has gone wrong with CalCodeFormatter. It can't find the button to turn it on.");
    throw "Can't find button element.";
}
else {
    // Narrow the type to a non-nullable element.
    button = button_or_null;
}
// Set current status in button.
// Default to on.
chrome.storage.sync.get({ active: true }, ({ active }) => {
    setButtonActiveStatus(button, active);
    chrome.storage.sync.set({ active });
});
button.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    let res = yield chrome.storage.sync.get('active');
    let current_status = res['active'];
    // Set inverted.
    yield chrome.storage.sync.set({ active: !current_status });
    setButtonActiveStatus(button, !current_status);
}));
//# sourceMappingURL=popup.js.map