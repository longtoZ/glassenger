chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({"DATA" : {
        "switch": "off",
        "background-img": "",
        "blur-strength": "0",
        "opacity": "0"
    }}, () => {
        if (!chrome.runtime.lastError) {
            console.log('Set data successfully')
        } else {
            console.log('Set data failed')
        }
    })

})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        console.log('changed to ', changeInfo.url)
        // Send a message to the content script whenever the URL changes
        chrome.tabs.sendMessage(tabId, { type: "urlChange", newUrl: changeInfo.url })
    }
});
