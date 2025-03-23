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
  const terminal = document.getElementById("terminal");

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

  try {
    const response = await fetch(`/command/${cmd}`);
    const data = await response.json();
    const terminal = document.getElementById("terminal");
    
    // Add the new content and get a reference to the command line added
    const elements = addToTerminal(
      terminal,
      cmd,
      data.output
    );
    
    // Scroll the command line into view
    if (elements && elements.cmdLine) {
      elements.cmdLine.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  } catch (error) {
    console.error("Error:", error);
    const terminal = document.getElementById("terminal");
    
    const elements = addToTerminal(
      terminal,
      cmd,
      "Error executing command. Please try again."
    );
    
    // Scroll the command line into view
    if (elements && elements.cmdLine) {
      elements.cmdLine.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }
}

// Initialize the terminal when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("terminalContainer");
  const terminal = document.getElementById("terminal");

  // When the container finishes its animation, animate the text and dollar sign.
  container.addEventListener("animationend", async () => {
    await Promise.all([animateTerminalIntro(), animateDollar()]);
    setupInput();
  });
});

// Main JavaScript for the portfolio terminal

document.addEventListener('DOMContentLoaded', () => {
    const terminalInput = document.getElementById('terminal-input');
    const terminalContent = document.querySelector('.terminal-content');
    
    // Focus the input when clicking anywhere in the terminal
    document.querySelector('.terminal').addEventListener('click', () => {
        terminalInput.focus();
    });
    
    // Handle terminal commands
    terminalInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            const command = terminalInput.value.trim().toLowerCase();
            terminalInput.value = '';
            
            // Display the command
            const commandLine = document.createElement('div');
            commandLine.innerHTML = `<span class="prompt">visitor@portfolio:~$</span> ${command}`;
            terminalContent.appendChild(commandLine);
            
            // Process commands
            if (command) {
                try {
                    const response = await fetch(`/command/${command}`);
                    const data = await response.json();
                    
                    // Create output element
                    const outputElement = document.createElement('div');
                    outputElement.classList.add('command-output');
                    outputElement.innerHTML = data.output.replace(/\n/g, '<br>');
                    
                    // Special handling for 'cls' command
                    if (command === 'cls') {
                        terminalContent.innerHTML = '';
                        return;
                    }
                    
                    // Add the output to the terminal
                    terminalContent.appendChild(outputElement);
                    
                    // Scroll to the command line
                    commandLine.scrollIntoView({ behavior: 'auto', block: 'start' });
                } catch (error) {
                    // Handle error
                    const errorElement = document.createElement('div');
                    errorElement.classList.add('command-output', 'error');
                    errorElement.textContent = "Command not found. Type 'help' for a list of commands";
                    terminalContent.appendChild(errorElement);
                    
                    // Scroll to the command line
                    commandLine.scrollIntoView({ behavior: 'auto', block: 'start' });
                }
            }
        }
    });
    
    // Auto-focus the input on page load
    terminalInput.focus();
    
    // Display welcome message
    if (terminalContent.children.length === 0) {
        const welcomeMsg = document.createElement('div');
        welcomeMsg.innerHTML = `
            <div class="welcome-message">
                <h1>Welcome to Zain Rashid's Portfolio Terminal</h1>
                <p>Type <strong>'help'</strong> to see available commands</p>
            </div>
        `;
        terminalContent.appendChild(welcomeMsg);
    }
});

