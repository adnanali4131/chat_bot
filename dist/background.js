/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
chrome.runtime.onInstalled.addListener((details) => {
    chrome.contextMenus.create({
        title: "Search on GPT",
        id: "GPT3",
        contexts: ["page", "selection"],
    });
    chrome.contextMenus.onClicked.addListener((e) => {
        const selectedData = e.selectionText;
        console.log(selectedData);
        // Store the selected data in Chrome's local storage
        chrome.storage.local.set({ "selectedData": selectedData }, function () {
            console.log('Value is set to ' + selectedData);
        });
    });
});

/******/ })()
;
//# sourceMappingURL=background.js.map