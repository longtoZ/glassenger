let dataObj = {}
const imgInput = document.querySelector('#upload-img')
const preview = document.querySelector(".upload-img-preview")
const modeOn = document.querySelector('#mode-on')
const modeOff = document.querySelector('#mode-off')
const loadBtn = document.querySelector("#load-container")

chrome.storage.sync.get("DATA", function(data)  {
    dataObj = data["DATA"]
    if (dataObj["background-img"] != '') {
        preview.src = chrome.runtime.getURL(`../img/${dataObj["background-img"]}`)
        imgInput.value = dataObj["background-img"]
    }
    if (dataObj["switch"] == "on") {
        modeOn.checked = true
    } else {
        modeOff.checked = true
    }

})

// wallpaperflare.com_wallpaper-3.jpg

// Update image preview on change
imgInput.addEventListener('change', function() {
    preview.src = chrome.runtime.getURL(`../img/${this.value}`)
    imgInput.value = this.value
    dataObj["background-img"] = this.value
})


// Save to local storage
loadBtn.addEventListener("click", function() {
    if (modeOn.checked) {
        dataObj["switch"] = "on"
    } else {
        dataObj["switch"] = "off"
    }

    chrome.storage.sync.set({"DATA" : dataObj}, () => {
        if (!chrome.runtime.lastError) {
            console.log('Set data successfully')
            sendMessage(dataObj)
        } else {
            console.log(chrome.runtime.lastError)
        }
    })

    // Reload page
    setTimeout(() => {
        window.close()
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.reload(tabs[0].id)
        })
    }, 500)
})

function sendMessage(obj) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, obj, function (response) {
        })
    })
}