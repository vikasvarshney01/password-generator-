// content.js - Auto-fill and optionally prompt to save new credentials
document.addEventListener('DOMContentLoaded', () => {
  const usernameField = document.querySelector(
    'input[type="text"], input[type="email"], input[name*="user"], input[name*="email"]'
  );
  const passwordField = document.querySelector('input[type="password"]');
  const site = window.location.hostname;

  if (!usernameField || !passwordField) return;

  chrome.storage.local.get(site, (data) => {
    const entry = data[site];

    if (entry && entry.username && entry.password) {
      // Auto-fill saved credentials
      usernameField.value = entry.username;
      passwordField.value = entry.password;
    } else {
      // Prompt to save only if both fields are empty
      if (!usernameField.value && !passwordField.value) {
        chrome.runtime.sendMessage({
          action: "promptSavePassword",
          username: "",
          password: "",
          site: site
        });
      }
    }
  });
});
