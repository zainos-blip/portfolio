import { formatText, addToTerminal } from "/static/js/utils.js";

// Default intro lines for the terminal
const defaultIntro = [
  "Welcome to my flashy resume terminal!",
  "Type 'help' to see available commands.",
  "" // Empty line for spacing
];

// Flag to prevent overlapping animations
let isAnimating = false;

// A helper function that animates text letter-by-letter in a given element.
function animateText(element, text, speed = 50) {
  return new Promise((resolve) => {
    element.textContent = "";
    let i = 0;
    const interval = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

// Animate an array of lines sequentially into the terminal area.
async function animateTerminalIntro() {
  const terminal = document.getElementById("terminal");
  terminal.innerHTML = ""; // Clear the terminal

  for (const line of defaultIntro) {
    const p = document.createElement("p");
    terminal.appendChild(p);
    await animateText(p, line, 40);
  }
}

// Animate the dollar sign (pixelated assembling)
async function animateDollar() {
  const dollar = document.getElementById("cmdDollar");
  await animateText(dollar, "$", 150);
}

// Set up the input listener for commands
function setupInput() {
  const input = document.getElementById("cmdInput");

  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const cmd = input.value.trim();
      if (cmd) {
        input.value = "";
        executeCommand(cmd);
      }
    }
  });
}

// Execute a command entered in the terminal.
async function executeCommand(cmd) {
  if (cmd.toLowerCase() === "cls") {
    // Prevent concurrent animations by checking the flag.
    if (isAnimating) return;
    isAnimating = true;
    await animateTerminalIntro();
    isAnimating = false;
    return;
  }

  fetch(`/command/${cmd}`)
    .then((response) => response.json())
    .then((data) => {
      addToTerminal(
        document.getElementById("terminal"),
        cmd,
        formatText(data.output)
      );
    })
    .catch((error) => console.error("Error:", error));
}

// Wait for the terminal container's "assemble" animation to finish, then animate the text.
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("terminalContainer");

  // When the container finishes its animation, animate the text and dollar sign.
  container.addEventListener("animationend", async () => {
    await Promise.all([animateTerminalIntro(), animateDollar()]);
    setupInput();
  });
});

