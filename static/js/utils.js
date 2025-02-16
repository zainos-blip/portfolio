export function formatText(text) {
    return `<span class="text-green-400">${text}</span>`;
  }
  
  export function addToTerminal(terminal, cmd, output) {
    terminal.innerHTML += `<p class="text-green-300">> ${cmd}</p>`;
    terminal.innerHTML += `<p class="text-green-400">${output}</p>`;
    terminal.innerHTML += `<br>`; // Add spacing for readability
    terminal.scrollTop = terminal.scrollHeight; // Auto-scroll to the latest input
  }
  