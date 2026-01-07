const passwordInput = document.getElementById("password");
const strengthText = document.getElementById("strength");

passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 1) {
    strengthText.textContent = "Weak Password ❌";
    strengthText.style.color = "red";
  } else if (strength === 2 || strength === 3) {
    strengthText.textContent = "Medium Password ⚠️";
    strengthText.style.color = "orange";
  } else {
    strengthText.textContent = "Strong Password ✅";
    strengthText.style.color = "green";
  }
});
