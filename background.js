chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({"DATA" : {
        "switch": "off",
        "background-img": ""
    }}, () => {})

    chrome.storage.sync.set({"ADJUSTMENT" : {
        "blur": "0",
        "brightness": "1",
        "contrast": "1",
        "opacity": "1",
        "grayscale": "0",
        "hue-rotate": "0",
        "invert": "0",
        "saturate": "1",
        "sepia": "0"
    }}, () => {})

})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        console.log('changed to ', changeInfo.url)
        // Send a message to the content script whenever the URL changes
        chrome.tabs.sendMessage(tabId, { type: "urlChange", newUrl: changeInfo.url })
    }
});
