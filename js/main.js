// // ------------------------------------------------------
// // PASSWORD GENERATOR FUNCTION
// // ------------------------------------------------------
// const generatePassword = (length, charset) => {
//     let password = "";
//     for (let i = 0; i < length; i++) {
//         password += charset.charAt(Math.floor(Math.random() * charset.length));
//     }
//     return password;
// };

// document.addEventListener("DOMContentLoaded", () => {

//     // ------------------------------------------------------
//     // DOM ELEMENTS
//     // ------------------------------------------------------
//     const generateBtn = document.getElementById("generate");
//     const passwordInput = document.getElementById("passwordField");
//     const lengthSlider = document.getElementById("length");
//     const lengthValue = document.querySelector("label[for='length'] span");

//     const optLower = document.getElementById("lowercase");
//     const optUpper = document.getElementById("uppercase");
//     const optNumbers = document.getElementById("numbers");
//     const optSymbols = document.getElementById("symbols");

//     const copyBtn = document.getElementById("copy");
//     const tooltip = document.getElementById("tooltip");
//     const passwordStrength = document.getElementById("passwordStrength");


//     // ------------------------------------------------------
//     // UPDATE LENGTH DISPLAY
//     // ------------------------------------------------------
//     const updateLengthDisplay = () => {
//         lengthValue.textContent = lengthSlider.value;
//     };
//     lengthSlider.addEventListener("input", updateLengthDisplay);


//     // ------------------------------------------------------
//     // ENABLE/DISABLE GENERATE BUTTON
//     // ------------------------------------------------------
//     const options = [optLower, optUpper, optNumbers, optSymbols];

//     const updateGenerateButtonState = () => {
//         const hasOptionChecked = options.some(opt => opt.checked);
//         generateBtn.disabled = !hasOptionChecked;
//     };

//     options.forEach(opt => opt.addEventListener("change", updateGenerateButtonState));


//     // ------------------------------------------------------
//     // PASSWORD STRENGTH CHECKER
//     // ------------------------------------------------------
//     const checkPasswordStrength = (pwd) => {
//         if (pwd.length < 5) return "Weak";
//         if (pwd.length < 10) return "Medium";
//         return "Strong";
//     };


//     // ------------------------------------------------------
//     // GENERATE PASSWORD EVENT
//     // ------------------------------------------------------
//     generateBtn.addEventListener("click", (e) => {
//         e.preventDefault();

//         let charset = "";

//         if (optLower.checked) charset += "abcdefghijklmnopqrstuvwxyz";
//         if (optUpper.checked) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//         if (optNumbers.checked) charset += "0123456789";
//         if (optSymbols.checked) charset += "!@#$%^&*_-+=?";

//         const length = parseInt(lengthSlider.value);
//         const password = generatePassword(length, charset);

//         passwordInput.value = password;

//         // Update strength display
//         const strength = checkPasswordStrength(password);
//         passwordStrength.textContent = `Strength: ${strength}`;
//     });


//     // ------------------------------------------------------
//     // COPY PASSWORD
//     // ------------------------------------------------------
//     copyBtn.addEventListener("click", (e) => {
//         e.preventDefault();

//         if (!passwordInput.value) return;

//         navigator.clipboard.writeText(passwordInput.value);

//         tooltip.style.opacity = "1";
//         setTimeout(() => (tooltip.style.opacity = "0"), 1500);
//     });
// });

// main.js — Password Generator (matches provided HTML ids)

// Secure random integer in range [0, max)
const secureRandomInt = (max) => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
};

const generatePassword = (length, charset) => {
  if (!charset || charset.length === 0) return "";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += charset.charAt(secureRandomInt(charset.length));
  }
  return out;
};

// Simple strength evaluation (returns score 0..4 and label)
const evaluateStrength = (pwd, optionsChecked) => {
  if (!pwd) return { score: 0, label: "—" };

  let score = 0;

  // length points
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;

  // variety points
  const hasLower = /[a-z]/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasNum   = /[0-9]/.test(pwd);
  const hasSym   = /[!@#\$%\^&\*\-_=\+\?]/.test(pwd);

  const variety = [hasLower, hasUpper, hasNum, hasSym].filter(Boolean).length;
  if (variety >= 2) score++;
  if (variety >= 3) score++;

  // clamp 0..4
  score = Math.min(4, Math.max(0, score));

  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] || "—" };
};

document.addEventListener("DOMContentLoaded", () => {
  // DOM elements (matching your HTML)
  const passwordInput = document.getElementById("password");
  const lengthSlider  = document.getElementById("length");
  const lengthValue   = document.getElementById("lengthValue");

  const optLower  = document.getElementById("lowercase");
  const optUpper  = document.getElementById("uppercase");
  const optNums   = document.getElementById("numbers");
  const optSyms   = document.getElementById("symbols");

  const generateBtn = document.getElementById("generate");
  const copyBtn     = document.getElementById("copy");
  const tooltip     = document.getElementById("tooltip");

  const strengthText = document.getElementById("passwordStrength");
  const strengthBar  = document.getElementById("strengthIndicator");

  // options array for convenience
  const options = [optLower, optUpper, optNums, optSyms];

  // Map checkbox states -> charset
  const buildCharset = () => {
    let charset = "";
    if (optLower.checked) charset += "abcdefghijklmnopqrstuvwxyz";
    if (optUpper.checked) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (optNums.checked)  charset += "0123456789";
    if (optSyms.checked)  charset += "!@#$%^&*_-+=?";
    return charset;
  };

  // Update length UI
  const updateLengthDisplay = () => {
    lengthValue.textContent = lengthSlider.value;
  };

  // Enable/disable generate button depending on options
  const updateGenerateButtonState = () => {
    const anyChecked = options.some(o => o.checked);
    generateBtn.disabled = !anyChecked;
  };

  // Update strength visual (text + bar)
  const updateStrengthUI = (pwd) => {
    const { score, label } = evaluateStrength(pwd);
    strengthText.textContent = `Strength: ${label}`;

    // Bar: width from 0% to 100% based on score (0..4)
    const pct = (score / 4) * 100;
    strengthBar.style.width = `${pct}%`;

    // Color: red -> orange -> yellow -> lightgreen -> green
    let color = "#b71c1c"; // very weak
    if (score === 1) color = "#e65100";
    if (score === 2) color = "#f9a825";
    if (score === 3) color = "#8bc34a";
    if (score === 4) color = "#2e7d32";
    strengthBar.style.background = color;
  };

  // Generate handler
  const onGenerate = (e) => {
    e.preventDefault();
    const charset = buildCharset();
    if (!charset) return; // safety

    const length = parseInt(lengthSlider.value, 10);
    const pwd = generatePassword(length, charset);
    passwordInput.value = pwd;
    updateStrengthUI(pwd);
  };

  // Copy handler
  const onCopy = async (e) => {
    e.preventDefault();
    const value = passwordInput.value;
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      // show tooltip briefly
      tooltip.style.opacity = "1";
      tooltip.style.transform = "translateY(0)";
      setTimeout(() => {
        tooltip.style.opacity = "0";
        tooltip.style.transform = "translateY(-6px)";
      }, 1400);
    } catch (err) {
      // fallback: select + execCommand (older browsers)
      passwordInput.select();
      document.execCommand("copy");
      tooltip.style.opacity = "1";
      setTimeout(() => (tooltip.style.opacity = "0"), 1200);
    }
  };

  // Wire events
  lengthSlider.addEventListener("input", () => {
    updateLengthDisplay();
    // if password exists, re-evaluate strength (length changed)
    updateStrengthUI(passwordInput.value);
  });

  options.forEach(opt => {
    opt.addEventListener("change", () => {
      updateGenerateButtonState();
      // if there's already a generated password, we can update strength
      updateStrengthUI(passwordInput.value);
    });
  });

  generateBtn.addEventListener("click", onGenerate);
  copyBtn.addEventListener("click", onCopy);

  // INITIAL STATE
  updateLengthDisplay();
  updateGenerateButtonState();
  updateStrengthUI(""); // blank initial
});
