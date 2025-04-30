// popup.js
function generatePassword() {
  const length = parseInt(document.getElementById("password-length").value);
  const includeLower = document.getElementById("include-lower").checked;
  const includeUpper = document.getElementById("include-upper").checked;
  const includeNumbers = document.getElementById("include-numbers").checked;
  const includeSymbols = document.getElementById("include-symbols").checked;

  let charset = "";
  if (includeLower) charset += "abcdefghijklmnopqrstuvwxyz";
  if (includeUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeNumbers) charset += "0123456789";
  if (includeSymbols) charset += "!@#$%^&*()_+[]{}|;:,.<>?";

  if (!charset) {
    alert("Please select at least one character type.");
    return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    const rand = Math.floor(Math.random() * charset.length);
    password += charset[rand];
  }

  document.getElementById("generated-password").value = password;
  evaluateStrength(password);

  chrome.runtime.sendMessage({
    action: "promptSavePassword",
    username: "user123",
    password: password,
    site: "example.com"
  });
}

function evaluateStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const strengthText = document.getElementById('strength-meter');
  const strengthValue = strengthText.querySelector('span');

  if (score <= 1) {
    strengthValue.textContent = 'Weak';
    strengthValue.className = 'font-bold text-red-500';
  } else if (score === 2 || score === 3) {
    strengthValue.textContent = 'Medium';
    strengthValue.className = 'font-bold text-yellow-400';
  } else {
    strengthValue.textContent = 'Strong';
    strengthValue.className = 'font-bold text-green-400';
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "promptSavePassword") {
    const prompt = document.getElementById("save-prompt");
    prompt.innerHTML = `Save password for ${message.site}? <button class="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded" onclick="savePassword('${message.site}', '${message.username}', '${message.password}')">Save</button>`;
  }
});

function savePassword(site, username, password) {
  chrome.storage.local.set({ [site]: { username, password } }, () => {
    alert("Password saved!");
  });
}

document.getElementById('theme-toggle').addEventListener('change', (e) => {
  if (e.target.checked) {
    document.body.classList.remove('bg-gray-100', 'text-black');
    document.body.classList.add('bg-gray-900', 'text-white');
  } else {
    document.body.classList.remove('bg-gray-900', 'text-white');
    document.body.classList.add('bg-gray-100', 'text-black');
  }
});
