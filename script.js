var generatedPasswords = new Set();

function generatePassword() {
  var length = document.getElementById('length').value;
  if (length < 10)
    length = 10;
  else if (length > 100)
    length = 100;

  var includeUppercase = document.getElementById('uppercase').checked;
  var includeLowercase = document.getElementById('lowercase').checked;
  var includeNumbers = document.getElementById('numbers').checked;
  var includeSpecial = document.getElementById('special').checked;
  var easyToRemember = document.getElementById('memorable').checked;

  var characters = '';

  if (includeUppercase) {
    characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }
  if (includeLowercase) {
    characters += 'abcdefghijklmnopqrstuvwxyz';
  }
  if (includeNumbers) {
    characters += '0123456789';
  }
  if (includeSpecial) {
    characters += '!@#$%^&*()';
  }

  if (easyToRemember && characters.length === 0) {
    characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }

  if (characters.length === 0) {
    alert('Selecteer ten minste een teken dat je wilt gebruiken.');
    return;
  }

  var password = '';
  var crypto = window.crypto || window.msCrypto;
  if (crypto && crypto.getRandomValues) {
    var values = new Uint8Array(length);
    crypto.getRandomValues(values);

    for (var i = 0; i < length; i++) {
      password += characters[values[i] % characters.length];
    }
  } else {
    for (var i = 0; i < length; i++) {
      var randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }
  }

  if (generatedPasswords.has(password)) {
    generatePassword();
    return;
  }

  generatedPasswords.add(password);

  document.getElementById('password').textContent = password;

  setTimeout(function () {
    document.getElementById('password').textContent = '';
    generatedPasswords.delete(password);
  }, 30000);
}

function checkPasswordStrength() {
  var password = document.getElementById('currentPassword').value;
  var strengthIndicator = document.getElementById('passwordStrength');

  var uniqueCharacters = new Set(password.split('')).size;

  var hasUppercase = /[A-Z]/.test(password);
  var hasSpecialChar = /[!@#$%^&*()]/.test(password);

  if (password.length < 6 || uniqueCharacters < 5) {
    strengthIndicator.textContent = 'makkelijk te kraken';
    strengthIndicator.style.color = 'red';
  } else if (password.length < 15 || !hasUppercase || !hasSpecialChar) {
    strengthIndicator.textContent = 'moeilijk te kraken';
    strengthIndicator.style.color = 'orange';
  } else {
    strengthIndicator.textContent = 'heel moeilijk om te kraken';
    strengthIndicator.style.color = 'green';
  }

  clearTimeout(checkPasswordStrength.timeout);
  checkPasswordStrength.timeout = setTimeout(function () {
    document.getElementById('currentPassword').value = '';
    strengthIndicator.textContent = '';
  }, 30000);
}

function togglePasswordVisibility() {
  var passwordInput = document.getElementById('currentPassword');
  var toggleButton = document.getElementById('toggleButton');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleButton.textContent = 'Verberg wachtwoord';
  } else {
    passwordInput.type = 'password';
    toggleButton.textContent = 'Toon wachtwoord';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var generateButton = document.getElementById('generateButton');
  generateButton.addEventListener('click', generatePassword);

  var passwordInput = document.getElementById('currentPassword');
  passwordInput.addEventListener('input', checkPasswordStrength);

  var toggleButton = document.getElementById('toggleButton');
  toggleButton.addEventListener('click', togglePasswordVisibility);
});
