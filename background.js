// background.js - Listen for messages from content.js and handle password saving
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "promptSavePassword") {
      // Show a prompt in the popup asking the user if they want to save the password
      chrome.storage.local.set({ [message.site]: { username: message.username, password: message.password } });
    }
  });
  