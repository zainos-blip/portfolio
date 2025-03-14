export function formatText(text) {
    return `<span class="text-green-400">${text}</span>`;
  }
  
  export function addToTerminal(terminal, cmd, output) {
    // Add the command
    const cmdLine = document.createElement('p');
    cmdLine.className = 'text-green-300';
    cmdLine.textContent = `> ${cmd}`;
    terminal.appendChild(cmdLine);

    // Add the output
    const outputLine = document.createElement('p');
    outputLine.className = 'text-green-400';
    outputLine.innerHTML = output;
    terminal.appendChild(outputLine);

    // Add spacing
    const spacer = document.createElement('br');
    terminal.appendChild(spacer);

    // Scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
  }
  
  // Utility functions for the portfolio site

  // Adjust element sizes based on viewport
  function adjustForMobile() {
    const isMobile = window.innerWidth < 768;
    const terminal = document.querySelector('.terminal');
    const terminalContent = document.querySelector('.terminal-content');
    
    if (isMobile) {
        // Adjust font sizes for mobile
        document.body.classList.add('mobile-view');
        
        // Adjust terminal size for mobile
        if (terminal) {
            terminal.style.width = '95%';
            terminal.style.height = 'auto';
            terminal.style.maxHeight = '80vh';
        }
        
        // Adjust content padding for mobile
        if (terminalContent) {
            terminalContent.style.padding = '10px';
        }
    } else {
        document.body.classList.remove('mobile-view');
        
        // Reset terminal size for desktop
        if (terminal) {
            terminal.style.width = '';
            terminal.style.height = '';
            terminal.style.maxHeight = '';
        }
        
        // Reset content padding for desktop
        if (terminalContent) {
            terminalContent.style.padding = '';
        }
    }
  }

  // Call the function on load and resize
  window.addEventListener('load', adjustForMobile);
  window.addEventListener('resize', adjustForMobile);
  