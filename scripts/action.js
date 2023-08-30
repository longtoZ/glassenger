chrome.storage.sync.get("DATA", function(data)  {
    dataObj = data["DATA"]

    if (dataObj["switch"] == "on") {

        const body = document.querySelector('body')

        body.style.backgroundImage = `url('${chrome.runtime.getURL(`../img/${dataObj["background-img"]}`)}')`
        body.style.backgroundSize = 'cover'
        body.style.backgroundRepeat = 'no-repeat'
        body.style.height = '100vh'
        body.style.overflow = 'hidden'
        main()
    
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if (!chrome.runtime.lastError) {
                if (request.type=="urlChange") {
                    console.log('changed to new url')
                    setTimeout(main, 100)
                }
            }
            sendResponse('received')
        
        })
    }


})


function main() {

    waitForElementToExist('div[role="main"]').then(function() {
        const url = document.baseURI
        console.log(url)
        if (url.includes('mess')) {
            messengerSite()
        } else {
            facebookSite()
        }
    })
}

function messengerSite() {

    // Set background color to messages box
    document.querySelectorAll('div[dir="auto"]').forEach(i => {
        if (i.textContent.length>0) {
            i.parentElement.parentElement.style.background = 'rgba(0,0,0,0.2)'
            i.parentElement.parentElement.style.borderRadiu = '20px'
        }
    })

    // Set background for conversation box 
    const conversation = document.querySelector('div[role="main"]')
    const conversationHeader = document.querySelector('div[aria-label][role="main"]').firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild
    const conversationType = document.querySelector('div[aria-label][role="main"]').firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.lastChild.firstChild.firstChild.lastChild
    const stickerBtn = conversationType.querySelectorAll('div[role="button"]')[2]
    const navigation = document.querySelectorAll('div[role="navigation"]')[2]
    const navigationSearch = navigation.querySelector('label')
    const navigationButton = navigation.querySelectorAll('div[role="button"]')
    const newChatBtn = navigation.querySelector('a[role="link"][href="/messages/new/"]')
    const bannerSearch = document.querySelector('div[role="banner"] label')
    const mainContainer = conversation.parentElement
    const messages = document.querySelector('div[role="main"] div[role="grid"]').firstChild.firstChild.firstChild.firstChild.children[2].firstChild

    bannerSearch.classList.add('navigationSearch')
    navigationSearch.classList.add('navigationSearch')

    // Update blur background on new messages
    waitForNewMessage(messages, conversation, conversationHeader, conversationType, navigation)

    // Updated blur background on scroll 
    conversation.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.addEventListener('scroll', () => {
        handle(conversation, conversationHeader, conversationType, navigation)
    })

    navigationButton.forEach(i => {
        i.style.background = 'rgba(0,0,0,0.4)'
        i.addEventListener('click', handleMenu)
    })

    navigationSearch.addEventListener('click', function() {
        waitForElementToExist('ul[role="listbox"]').then(handleSearch)
    })

    newChatBtn.addEventListener('click', function() {
        waitForElementToExist('ul[role="listbox"]').then(handleNewChat).then(function() {
            const newChatSearch = document.querySelector('div[role="presentation"] input')
            
            newChatSearch.addEventListener('click', function() {
                waitForElementToExist('ul[role="listbox"]').then(handleNewChat)
            })
        })
    })

    stickerBtn.addEventListener('click', function() {
        waitForElementToExist('div[role="dialog"]').then(handleSticker)
    })


}

function facebookSite() {
    // document.querySelectorAll('div[aria-posinset] > div > div > div > div').forEach(i => {
    //     i.classList.add('post')
    // })

    document.querySelectorAll('div').forEach(i => {
        if (i.style.borderRadius.includes('max')) {
            i.classList.add('post')
        }
    })

    if (document.querySelectorAll('div[role="navigation"]')[2]) {
        const nav = document.querySelectorAll('div[role="navigation"]')[2].querySelector('div > div > div')
        nav.classList.add('fbNavigation')
    }


    const comp = document.querySelector('div[role="complementary"] > div > div > div')
    comp.classList.add('fbComplementary')

    const banner = document.querySelectorAll('div[role="navigation"]')[0]
    banner.parentElement.parentElement.classList.add('fbBanner')
    banner.parentElement.nextElementSibling.style.display = 'none'

    const story = document.querySelectorAll('div[role="region"]')[0]
    story.classList.add('fbStory')

    document.querySelector('body').addEventListener('scroll', () => {
        handleFb()
    })
}

function handleSticker() {
    const sticker = document.querySelector('div[role="dialog"]')

    sticker.querySelector('svg').style.display = 'none'
    sticker.firstChild.classList.add('stickerParent1')
    sticker.classList.add('stickerParent2')

}

function handleMenu() {

    waitForElementToExist('div[role="menu"]').then(() => {
        const navigationMenu = document.querySelector('div[role="menu"]')

        navigationMenu.style.borderRadius = '20px'
        navigationMenu.firstChild.classList.add('navigationMenu')
        navigationMenu.lastChild.style.display = 'none'
    })

}

function handleSearch() {
    document.querySelector('ul[role="listbox"]').parentElement.parentElement.parentElement.classList.add('listbox')
}

function handleNewChat() {
    const newChat = document.querySelector('div[role="presentation"]')

    document.querySelector('ul[role="listbox"]').parentElement.classList.add('listbox-search')
    newChat.style.background = 'none'
    newChat.parentElement.parentElement.parentElement.parentElement.parentElement.style.background = 'none'
    newChat.parentElement.parentElement.parentElement.classList.add('newChat')
    newChat.parentElement.parentElement.parentElement.parentElement.style.background = 'none'

}

function handle(conversation, conversationHeader, conversationType, navigation) {
    document.querySelectorAll('div:not([role="img"]):not([role="menu"]').forEach(i => {
        i.classList.add('resetSite')
    })

    
    conversation.classList.add('conversation')

    conversationHeader.classList.add('conversationHeader')

    document.querySelectorAll('div[aria-label][role="main"] span:not([role="gridcell"])').forEach(j => {
        const dateBreak1 = j.parentElement.hasAttribute('data-scope')
        const dateBreak2 = j.parentElement.parentElement.hasAttribute('data-scope')
        const linkTitle = j.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.hasAttribute('target')
        const linkTitle2 = j.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.hasAttribute('target')

        if (j.textContent != '') {
            if (!dateBreak1 && !dateBreak2) {
                j.style.background = 'rgb(0 0 0 / 40%)'
                j.style.borderRadius = '15px'
                j.style.margin = '2px 0'
            }

            if (linkTitle || linkTitle2) {
                j.style.background = 'none'
            }
        }


    })

    // Remove background for right sidebar
    if (document.querySelector('div[role="list"]')) {
        document.querySelectorAll('div[role="list"] span').forEach(i => i.style.background = 'none')
        document.querySelector('div[role="list"]').parentElement.previousElementSibling.querySelectorAll('span').forEach(i => {
            if (i.textContent != '') {
                i.style.background = 'none'
            }
        })
    }




    conversationHeader.querySelectorAll('span').forEach(i => {
        if (i.textContent != '') {
            i.style.background = 'none'
        }
    })

    conversationType.classList.add('conversationType')

    navigation.classList.add('navigation')

    navigation.firstChild.firstChild.firstChild.firstChild.style.width = '100%'
}

function handleFb() {
    document.querySelectorAll('div').forEach(i => {
        if (i.style.borderRadius.includes('max')) {
            i.classList.add('post')
        }
    })

    document.querySelectorAll('div[role="article"]').forEach(i => i.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild.style.background = 'rgba(0,0,0,0.4)')
    document.querySelector('div[role="textbox"]').parentElement.parentElement.parentElement.parentElement.parentElement.style.background = 'rgba(0,0,0,0.4)'
}

function waitForNewMessage(selector, conversation, conversationHeader, conversationType, navigation) {
    const observer = new MutationObserver((mutations) => {
        if (mutations[0].type === "childList") {
            handle(conversation, conversationHeader, conversationType, navigation)
        }
    })

    observer.observe(selector, {
        childList: true
    })
}

function waitForElementToExist(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
  
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });
  
      observer.observe(document.body, {
        subtree: true,
        childList: true,
      });
    });
}
