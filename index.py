#!/usr/bin/env python3

from flask import Flask, request, render_template, jsonify
from flask_limiter import Limiter
from flask_talisman import Talisman
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# For Vercel deployment
app = app

csp = {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-inline' https://cdn.tailwindcss.com",
    'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
    'font-src': "'self' https://fonts.gstatic.com"
}

Talisman(app, content_security_policy=csp)

def get_real_ip():
    forwarded_for = request.headers.get("X-Forwarded-For")

    if forwarded_for:
        return forwarded_for.split(",")[0].strip()   # extracts the first IP which is the real IP of the client in the proxies
    return request.headers.get("X-Real-IP", request.remote_addr)   # if "X-Forwarded-For" not set, we check the "X-Real-IP"

limiter = Limiter(
    key_func=get_real_ip,
    default_limits=["200 per hour"]  # Global limit
)
limiter.init_app(app)

commands = {
    "help": """ 
╔════════════════════════════╗
║   🔹 AVAILABLE COMMANDS 🔹 
╚════════════════════════════╝
┌────────────────────────────┐
│ help       → Show commands | 
│ about      → About me      | 
│ skills     → My skillset   | 
│ experience → Work & CTFs   |  
│ contact    → Get in touch  | 
│ cls        → Clear screen  | 
└────────────────────────────┘
""",

    "about": """ 
╔══════════════════════════════════════════╗
║               🚀 ABOUT ME                ║
╚══════════════════════════════════════════╝
Hello! I'm Zain Rashid, a Cybersecurity student at Air University, Islamabad.
I specialize in offensive security, with expertise in identifying and exploiting vulnerabilities.
My focus is on strengthening digital systems through advanced attack simulation and defense. 

🎯 Interests:
- Offensive Security & Red Team Operations
- Attack Simulation, Threat Emulation & C2 Frameworks
- OPSEC for Stealth & ADversary Simulation
- MITRE ATT&CK Framework Application
- Low level Networking and automations in Python

⚡ Precision. Stealth. Resilience. ⚡
""",

    "skills": """ 
╔════════════════════════════════════╗
║         🛠️ TECHNICAL SKILLS        ║
╚════════════════════════════════════╝
📌 Programming Languages:
   - C | C++ | Python | Javascript  

📌 Offensive Security & Networking:
   - Kali Linux | Nmap | Wireshark | BurpSuite
   - Metasploit | beEF | C2 Frameworks (Mythic) | OPSEC Utils

📌 Tools & Platforms:
   - Git & Github | Docker | (VMware, VBox) |
   - Obsidian

📌 Soft Skills:
   - Team Player 🤝 | Effective Communicator 🗣️
   - English & Urdu Proficiency
""",

    "experience": """ 
╔══════════════════════════════════════════╗
║           🎯 EXPERIENCE & PROJECTS       ║
╚══════════════════════════════════════════╝
🔹 Internship:
   🏢 IT Intern @ Pearl Continental Hotel, Rawalpindi
   - Maintained IT infrastructure, performed security audits,
     managed hardware/software & conducted system backups.

🔹 Capture The Flag (CTF):
   🏆 NASCON CTF’23 | ByteBolt CTF’23 | NASCON CTF’24
   - Specialized in Web Exploitation & General categories.

🔹 Notable Projects:
   ✅ HTTP Proxy made in python using 'mitmproxy' which is used to monitor HTTP requests and responses,
      which is then filtered and showed via a website for frontend of the logs.    

   ✅ Researched & tested Browser Exploitation Framework (beEF)
   
   ✅ Web Scraper in python using 'playwright' library and making a web page for the scraped data
   
   ✅ Made this portfolio website using flask and implemented web security features such as:  

      -> CSP
      (Content Security Policy) which prevents XSS and loads what is in the self domain or the provided
      domain list and nothing else.
      
      -> Limiter module for allowing specific IP addresses to input in a specific
      time duration to ensure there is no brute force attack or DOS attack on the website.
      
      -> White Listing for allowing known input commands in the terminal.
    
💡 Always seeking challenges to refine my skills! 🚀
""",

    "contact": """ 
╔══════════════════════════════════════════╗
║              📞 CONTACT ME               ║
╚══════════════════════════════════════════╝
📧 Email: zain.rashid2004@gmail.com
🔗 LinkedIn: linkedin.com/in/zainrashid04/
🐙 GitHub: github.com/zainos-blip

"""
}

ALLOWED_COMMANDS = {"help", "about", "skills", "experience", "contact", "cls"}

@app.route('/')
def home():
    return render_template('index.html')


@app.route("/command/<cmd>")
@limiter.limit("20 per minute")    # rate limit on the command endpoint (20 per minute)
def run_command(cmd):
    if cmd not in ALLOWED_COMMANDS:
        return jsonify({'output': "Invalid command. Type 'help' for a list of commands"}), 400

    output = commands.get(cmd, "Command not found. Type 'help' for a list of commands.")
    return jsonify({'output': output})


if __name__ == "__main__":
    app.run(debug=True)
