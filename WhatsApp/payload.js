const init = async () => {
  console.log(window.Winside.vars.winsertId)

  function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

  const chatList = await waitForElement("div[aria-label=\"Chat list\"]")
  chatList.addEventListener("mouseup", async () => {
    document.querySelector("#side").classList.add("menu-closed")

    const header = await waitForElement("header[data-testid=\"conversation-header\"]")

    if(!header.firstChild.classList.contains("chat-menu-button")) {
      const menuBtn = document.createElement("button")
      menuBtn.classList.add("chat-menu-button")
      menuBtn.innerText = "🡠"
      
      header.prepend(menuBtn)
      
      menuBtn.addEventListener("click", () => {
        document.querySelector("#side").classList.remove("menu-closed")
      })
    }
  })

  // --- API Handling --- \\

  const permissionsModal = document.createElement("div")
  permissionsModal.classList.add("permissions-modal")
  permissionsModal.innerText = "Checking Permissions..."
  permissionsModal.classList.add("active")
  document.querySelector("body").append(permissionsModal)

  window.WinsideAPI.requestPermission(
    window.Winside.vars.winsertId,
    "keepOpenInBackground"
    ).then((result) => {
      if (result) {
        window.WinsideAPI.keepOpenInBackground(window.Winside.vars.winsertId)
        window.WinsideAPI.requestPermission(
          window.Winside.vars.winsertId,
          "sendNotifications"
        ).then(() => {
          permissionsModal.classList.remove("active")
        })
      } else {
        permissionsModal.classList.remove("active")
      }
    }).catch((err) => console.error(err))
  
}

if (document.readyState) init()
else document.addEventListener("DOMContentLoaded", init)