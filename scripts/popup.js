let dataObj = {}
let adjustmentObj = {}
const imgInput = document.querySelector('#upload-img')
const preview = document.querySelector(".upload-img-preview")
const modeOn = document.querySelector('#mode-on')
const modeOff = document.querySelector('#mode-off')
const adjustmentContainer = document.querySelectorAll('#adjustment-container input')
const loadBtn = document.querySelector("#load-container .load")
const resetBtn = document.querySelector('#load-container .reset')

chrome.storage.sync.get("DATA", function(data) {
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

chrome.storage.sync.get("ADJUSTMENT", function(data) {
    adjustmentObj = data["ADJUSTMENT"]
    adjustmentContainer.forEach(i => {
        i.value = adjustmentObj[i.getAttribute('class')]
    })

    let filterStr = []

    for (const j in adjustmentObj) {
        if (j=='hue-rotate') {
            filterStr.push(`${j}(${ adjustmentObj[j] }deg)`)
        } else if (j=='blur') {
            filterStr.push(`${j}(${ adjustmentObj[j] }px)`)
        } else {
            filterStr.push(`${j}(${ adjustmentObj[j] })`)

        }
    }

    preview.style.filter =  filterStr.join(' ')
    console.log(filterStr.join(' '))

})

// wallpaperflare.com_wallpaper-3.jpg

// Update image preview on change
imgInput.addEventListener('change', function() {
    preview.src = chrome.runtime.getURL(`../img/${this.value}`)
    imgInput.value = this.value
    dataObj["background-img"] = this.value
})

adjustmentContainer.forEach(i => {
    i.addEventListener('change', () => {
        adjustmentObj[i.getAttribute('class')] = i.value
        let filterStr = []

        for (const j in adjustmentObj) {
            if (j=='hue-rotate') {
                filterStr.push(`${j}(${ adjustmentObj[j] }deg)`)
            } else if (j=='blur') {
                filterStr.push(`${j}(${ adjustmentObj[j] }px)`)
            } else {
                filterStr.push(`${j}(${ adjustmentObj[j] })`)

            }
        }

        preview.style.filter =  filterStr.join(' ')

    })
})


// Save to local storage
loadBtn.addEventListener("click", function() {
    if (modeOn.checked) {
        dataObj["switch"] = "on"
    } else {
        dataObj["switch"] = "off"
    }

    // Save image adjustment
    for (const i in adjustmentObj) {
        if (i=='hue-rotate') {
            adjustmentObj[i] = document.querySelector(`.${i}`).value
        } else if (i=='blur') {
            adjustmentObj[i] = document.querySelector(`.${i}`).value
        } else {
            adjustmentObj[i] = document.querySelector(`.${i}`).value
        }
    }

    chrome.storage.sync.set({"DATA" : dataObj}, () => {
        if (!chrome.runtime.lastError) {
            console.log('Set data successfully')
            sendMessage(dataObj)
        } else {
            console.log(chrome.runtime.lastError)
        }
    })

    chrome.storage.sync.set({"ADJUSTMENT" : adjustmentObj}, () => {
        if (!chrome.runtime.lastError) {
            console.log('Set data successfully')
            sendMessage(adjustmentObj)
        } else {
            console.log(chrome.runtime.lastError)
        }
    })


})

// Reset all adjustment
resetBtn.addEventListener('click', function() {
    const initData = {
        "switch": "off",
        "background-img": ""
    }
    
    const initAdjustment = {
        "blur": "0",
        "brightness": "1",
        "contrast": "1",
        "opacity": "1",
        "grayscale": "0",
        "hue-rotate": "0",
        "invert": "0",
        "saturate": "1",
        "sepia": "0"
    }

    chrome.storage.sync.set({"DATA" : initData}, () => {
        if (!chrome.runtime.lastError) {
            console.log('Set data successfully')
        } else {
            console.log(chrome.runtime.lastError)
        }
    })

    chrome.storage.sync.set({"ADJUSTMENT" : initAdjustment}, () => {
        if (!chrome.runtime.lastError) {
            console.log('Set data successfully')
            
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