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

waitForElementToExist('div[role="main"]').then(function() {

    // Set background color to messages box
    document.querySelectorAll('div[dir="auto"]').forEach(i => {
        if (i.textContent.length>0) {
            i.parentElement.parentElement.style.background = 'rgba(0,0,0,0.2)'
            i.parentElement.parentElement.style.borderRadiu = '20px'
        }
    })

    // Set background for conversation box 
    let conversation = document.querySelector('div[role="main"]')
    let conversationHeader = document.querySelector('div[aria-label][role="main"]').firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild
    let conversationType = document.querySelector('div[aria-label][role="main"]').firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.lastChild.firstChild.firstChild.lastChild
    let navigation = document.querySelectorAll('div[role="navigation"]')[2]
    let mainContainer = conversation.parentElement

    console.log(conversation.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild)

    mainContainer.style.marginTop = '40px'
    console.log('here')

    // Updated blur background on scroll 
    conversation.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.addEventListener('scroll', () => {
        document.querySelectorAll('div:not([role="img"])').forEach(i => {
            i.style.background = 'none'
            i.style.color = 'white'
            i.style.boxShadow = 'none'
            i.style.border = 'none'
        })
        
        conversation.style.padding = '10px'
        conversation.style.margin = '0 10px'
        conversation.style.color = 'white'
        conversation.style.borderRadius = '20px'
        conversation.style.backdropFilter = 'blur(10px)'

        conversationHeader.style.background = 'rgba(0,0,0,0.07)'
        conversationHeader.style.borderRadius = '20px'
        conversationHeader.style.boxShadow = 'rgb(0 0 0 / 40%) 0px 0px 10px'
        conversationHeader.style.margin = '10px'

        conversationType.style.background = 'rgba(0,0,0,0.07)'
        conversationType.style.borderRadius = '20px'
        conversationType.style.boxShadow = 'rgb(0 0 0 / 40%) 0px 0px 10px'
        conversationType.style.margin = '10px'

        navigation.style.padding = '10px'
        navigation.style.margin = '0 10px'
        navigation.style.color = 'white'
        navigation.style.borderRadius = '20px'
        navigation.style.backdropFilter = 'blur(10px)'

        navigation.firstChild.firstChild.firstChild.firstChild.style.width = '100%'
    })
})