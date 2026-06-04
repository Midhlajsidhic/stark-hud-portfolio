document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // STARK WEB AUDIO SYSTEM (SYNTHESIZED SCI-FI HUD SOUNDS)
    // ==========================================================================
    class StarkAudio {
        constructor() {
            this.ctx = null;
        }
        
        init() {
            if (this.ctx) return;
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Simple click indicator
        playClick() {
            this.init();
            if (!this.ctx) return;
            
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
            
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start();
            osc.stop(now + 0.08);
        }
        
        // Rising power grid charge hum (duration in seconds)
        playCharge(duration) {
            this.init();
            if (!this.ctx) return;
            
            const now = this.ctx.currentTime;
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc1.type = 'sawtooth';
            osc1.frequency.setValueAtTime(60, now);
            osc1.frequency.linearRampToValueAtTime(320, now + duration);
            
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(62, now);
            osc2.frequency.linearRampToValueAtTime(322, now + duration);
            
            // Warm lowpass filter sweep
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(120, now);
            filter.frequency.linearRampToValueAtTime(600, now + duration);
            
            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.12, now + duration);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.4);
            
            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc1.start(now);
            osc2.start(now);
            
            osc1.stop(now + duration + 0.5);
            osc2.stop(now + duration + 0.5);
        }
        
        // Holographic tab transition sweep
        playTab() {
            this.init();
            if (!this.ctx) return;
            
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1100, now);
            osc.frequency.exponentialRampToValueAtTime(350, now + 0.15);
            
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start();
            osc.stop(now + 0.15);
        }
        
        // Pleasant digital mic startup chime
        playChime() {
            this.init();
            if (!this.ctx) return;
            
            const now = this.ctx.currentTime;
            const playTone = (freq, time, dur) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, time);
                gain.gain.setValueAtTime(0.05, time);
                gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(time);
                osc.stop(time + dur);
            };
            
            playTone(880.00, now, 0.1);    // A5
            playTone(1318.51, now + 0.07, 0.22); // E6
        }

        // Repeating warning siren for self destruct
        playAlarm(duration) {
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);

            // Modulate pitch up and down
            for (let t = 0; t < duration; t += 0.5) {
                osc.frequency.setValueAtTime(400, now + t);
                osc.frequency.linearRampToValueAtTime(700, now + t + 0.25);
                osc.frequency.linearRampToValueAtTime(400, now + t + 0.5);
            }

            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + duration);
        }
    }

    const audio = new StarkAudio();

    // Unlock Web Audio Context on document clicks
    document.addEventListener('click', () => {
        audio.init();
    }, { once: false });

    // ==========================================================================
    // HUD TIME CLOCK MODULE
    // ==========================================================================
    const hudTime = document.getElementById('hud-time');
    
    function updateClock() {
        const now = new Date();
        const hrs = String(now.getUTCHours()).padStart(2, '0');
        const mins = String(now.getUTCMinutes()).padStart(2, '0');
        const secs = String(now.getUTCSeconds()).padStart(2, '0');
        if (hudTime) {
            hudTime.textContent = `${hrs}:${mins}:${secs} UTC`;
        }
    }
    
    setInterval(updateClock, 1000);
    updateClock();

    // ==========================================================================
    // DATA CACHING & SCRAMBLED TEXT DECODER ANIMATION
    // ==========================================================================
    const textElementsToAnimate = [];
    const selectors = [
        '.hologram-header h2', '.hologram-tag', '.summary-paragraph',
        '.time-title', '.time-date', '.time-agency', '.time-tech',
        '.label', '.value', '.value a', 'h4', 'li'
    ];
    
    document.querySelectorAll('.resume-tab-content').forEach(tab => {
        selectors.forEach(sel => {
            tab.querySelectorAll(sel).forEach(el => {
                if (el.children.length === 0 && el.innerText.trim() !== '') {
                    el.setAttribute('data-original-text', el.innerText);
                    textElementsToAnimate.push(el);
                }
            });
        });
    });

    function scrambleAndDecrypt(element) {
        const originalText = element.getAttribute('data-original-text');
        if (!originalText) return;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()_+{}[]';
        let iterations = 0;
        
        element.innerText = '';
        
        const interval = setInterval(() => {
            element.innerText = originalText
                .split('')
                .map((char, index) => {
                    if (char === ' ' || char === '\n' || char === '\r') {
                        return char;
                    }
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iterations >= originalText.length) {
                clearInterval(interval);
                element.innerText = originalText;
            }
            
            iterations += 1.5;
        }, 15);
    }

    // ==========================================================================
    // HUD PANEL TAB TOGGLES
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.resume-tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTabId = btn.getAttribute('data-tab');
            audio.playTab(); // Play holographic transition beep
            switchTab(targetTabId, btn.textContent);
        });
    });

    function switchTab(tabId, labelText) {
        tabButtons.forEach(b => {
            if (b.getAttribute('data-tab') === tabId) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });
        
        tabContents.forEach(c => {
            if (c.id === tabId) {
                c.classList.add('active');
                
                // Add construction laser sweep
                const card = c.querySelector('.hologram-card');
                if (card) {
                    card.classList.remove('constructing');
                    void card.offsetWidth;
                    card.classList.add('constructing');
                }
                
                // Scramble elements inside
                c.querySelectorAll('[data-original-text]').forEach(el => {
                    scrambleAndDecrypt(el);
                });
            } else {
                c.classList.remove('active');
            }
        });
        
        addConsoleLog(`[JARVIS] Loading armory module: ${labelText}...`, 'jarvis-msg');
    }

    // ==========================================================================
    // CONSOLE LOGGER UTILITY
    // ==========================================================================
    const jarvisConsole = document.getElementById('jarvis-console');

    function addConsoleLog(text, type = 'system-msg') {
        const row = document.createElement('div');
        row.className = `console-row ${type}`;
        
        const now = new Date();
        const timestamp = `[${String(now.getUTCHours()).padStart(2,'0')}:${String(now.getUTCMinutes()).padStart(2,'0')}:${String(now.getUTCSeconds()).padStart(2,'0')}]`;
        
        row.textContent = `${timestamp} ${text}`;
        jarvisConsole.appendChild(row);
        
        jarvisConsole.scrollTop = jarvisConsole.scrollHeight;
    }

    // ==========================================================================
    // ARC REACTOR POWER BOOT SEQUENCE
    // ==========================================================================
    const reactorTrigger = document.getElementById('reactor-trigger');
    const reactorPower = document.getElementById('reactor-power');
    const reactorPrompt = document.getElementById('reactor-prompt');
    const sysStatusText = document.getElementById('sys-status-text');
    const mainResumePane = document.getElementById('main-resume-pane');
    
    const fillLog = document.getElementById('fill-log');
    const fillScan = document.getElementById('fill-scan');
    const fillCpu = document.getElementById('fill-cpu');
    
    const logFlowPct = document.getElementById('log-flow-pct');
    const scanRatePct = document.getElementById('scan-rate-pct');
    const cpuLoadPct = document.getElementById('cpu-load-pct');

    let systemBooted = false;

    if (reactorTrigger) {
        reactorTrigger.addEventListener('click', () => {
            triggerBootSequence();
        });
    }

    function triggerBootSequence() {
        if (systemBooted) return;
        systemBooted = true;
        
        // Play rising power hum
        audio.playCharge(4.5);
        
        reactorTrigger.classList.add('reactor-powered');
        reactorPrompt.textContent = "CORE SYSTEM ACTIVE";
        reactorPrompt.style.animation = "none";
        reactorPrompt.style.color = "var(--hud-cyan)";
        
        addConsoleLog("[SYSTEM] Arc Reactor core boot sequence triggered...", "success-msg");
        sysStatusText.textContent = "BOOTING... [25%]";
        sysStatusText.className = "text-orange";
        
        let power = 10;
        const powerInterval = setInterval(() => {
            power += 5;
            if (power <= 100) {
                reactorPower.textContent = `${power}%`;
            } else {
                clearInterval(powerInterval);
                triggerFullSystemNominal();
            }
        }, 225); // Set grid charge time to ~4.5 seconds to match hum duration
    }

    function triggerFullSystemNominal() {
        addConsoleLog("[SYSTEM] Power grids at 100% capacity. Syncing telemetry...", "success-msg");
        sysStatusText.textContent = "SYNCING... [80%]";
        sysStatusText.className = "text-warning";

        setTimeout(() => {
            addConsoleLog("[JARVIS] Host interface linked. Welcome back, Mr. Midhlaj.", "jarvis-msg");
            speakJarvis("Power grid active. Welcome back, Mr. Midhlaj. System diagnostic nominal.");
            addConsoleLog("[JARVIS] Accessing server database at Hashroot...", "jarvis-msg");
        }, 800);

        setTimeout(() => {
            addConsoleLog("[JARVIS] Scanning local network security telemetry...", "jarvis-msg");
            addConsoleLog("[JARVIS] Systems check: Linux (AlmaLinux, Ubuntu Server) admin online.", "success-msg");
            addConsoleLog("[JARVIS] Security components check: AWS clusters linked.", "success-msg");
        }, 1600);

        setTimeout(() => {
            mainResumePane.classList.remove('disabled-hud');
            mainResumePane.classList.add('active-hud');
            
            sysStatusText.textContent = "NOMINAL [100%]";
            sysStatusText.className = "text-success";
            addConsoleLog("[JARVIS] System fully nominal. Interactive holograms active.", "success-msg");
            
            // Decrypt diagnostic tab details on boot
            document.querySelectorAll('#tab-summary [data-original-text]').forEach(el => {
                scrambleAndDecrypt(el);
            });
            
            fillLog.style.width = "88%";
            logFlowPct.textContent = "744 bps";
            
            fillScan.style.width = "92%";
            scanRatePct.textContent = "92%";
            
            fillCpu.style.width = "64%";
            cpuLoadPct.textContent = "64%";
        }, 2500);
    }

    // ==========================================================================
    // JARVIS VOICE SYNTHESIS MODULE (FRIDAY / JARVIS TEXT-TO-SPEECH)
    // ==========================================================================
    function speakJarvis(text) {
        if (!('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.pitch = 0.85;
        utterance.rate = 1.05;
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English Male') || v.name.includes('Microsoft David') || v.lang === 'en-US');
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        window.speechSynthesis.speak(utterance);
    }

    // ==========================================================================
    // SPEECH RECOGNITION (VOICE DEPLOYMENT COMMAND CONSOLE)
    // ==========================================================================
    const voiceBtn = document.getElementById('voice-btn');
    const voiceStatus = document.getElementById('voice-status');
    let recognition;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => {
            audio.playChime(); // Play high-tech microphone wake chime
            voiceBtn.textContent = "🎙️ JARVIS LISTENING...";
            voiceBtn.classList.add('listening');
            voiceStatus.textContent = "MIC_STATUS: LISTENING";
            voiceStatus.className = "text-danger";
            addConsoleLog("[SYSTEM] Voice Recognition active. Command window open.", "system-msg");
        };

        recognition.onerror = (e) => {
            console.error(e);
            voiceBtn.textContent = "🎤 ACTIVATE VOICE SYSTEM";
            voiceBtn.classList.remove('listening');
            voiceStatus.textContent = "MIC_STATUS: ERROR";
            voiceStatus.className = "text-danger";
            addConsoleLog("[SYSTEM] Voice recognition error. Restart channel.", "danger-msg");
        };

        recognition.onend = () => {
            voiceBtn.textContent = "🎤 ACTIVATE VOICE SYSTEM";
            voiceBtn.classList.remove('listening');
            voiceStatus.textContent = "MIC_STATUS: STANDBY";
            voiceStatus.className = "text-warning";
        };

        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase().trim();
            addConsoleLog(`[USER] Voice Input: "${command}"`, 'jarvis-msg');
            parseVoiceCommand(command);
        };

        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                audio.playClick();
                try {
                    recognition.start();
                } catch(e) {
                    recognition.stop();
                }
            });
        }
    } else {
        if (voiceBtn) {
            voiceBtn.disabled = true;
            voiceBtn.textContent = "🎤 VOICE CONTROL UNSUPPORTED";
            voiceStatus.textContent = "MIC_STATUS: API_UNAVAILABLE";
            voiceStatus.className = "text-danger";
        }
    }

    // ==========================================================================
    // JARVIS CHATBOT & NLP COMMAND PARSER (RESPONDS TO EVERYTHING)
    // ==========================================================================
    function parseVoiceCommand(cmd) {
        if (cmd.includes('start') || cmd.includes('initialize') || cmd.includes('power up') || cmd.includes('system boot')) {
            if (!systemBooted) {
                triggerBootSequence();
            } else {
                speakJarvis("System is already fully operational, sir.");
                addConsoleLog("[JARVIS] System already operational.", "jarvis-msg");
            }
            return;
        }

        if (!systemBooted) {
            speakJarvis("Vocal commands locked. Please boot reactor core first.");
            addConsoleLog("[JARVIS] Core power offline. Voice commands locked.", "danger-msg");
            return;
        }

        // --- NAVIGATION COMMANDS ---
        if (cmd.includes('show diagnostic') || cmd.includes('show resume') || cmd.includes('show summary') || cmd.includes('go to diagnostic')) {
            audio.playTab();
            switchTab('tab-summary', 'DIAGNOSTIC');
            speakJarvis("Displaying identity diagnostics.");
            return;
        }
        if (cmd.includes('show skills') || cmd.includes('show armory') || cmd.includes('go to armory')) {
            audio.playTab();
            switchTab('tab-skills', 'ARMORY');
            speakJarvis("Loading armory modules and skills matrix.");
            return;
        }
        if (cmd.includes('show experience') || cmd.includes('show missions') || cmd.includes('go to missions') || cmd.includes('show work')) {
            audio.playTab();
            switchTab('tab-experience', 'MISSIONS');
            speakJarvis("Accessing mission log history.");
            return;
        }
        if (cmd.includes('show projects') || cmd.includes('show cores') || cmd.includes('go to cores') || cmd.includes('go to prototypes')) {
            audio.playTab();
            switchTab('tab-projects', 'CORES');
            speakJarvis("Retrieving project prototypes.");
            return;
        }
        if (cmd.includes('show badges') || cmd.includes('show credentials') || cmd.includes('show certifications') || cmd.includes('go to badges')) {
            audio.playTab();
            switchTab('tab-credentials', 'BADGES');
            speakJarvis("Opening verified certifications database.");
            return;
        }

        // --- CONVERSATIONAL CHATBOT RESPONSES ---
        
        // 1. Basic Greetings
        if (cmd.match(/\b(hello|hi|hey|greetings|good morning|good afternoon)\b/)) {
            const replies = [
                "Hello, sir. Operational channels active. How can I assist you today?",
                "Online and ready, sir. What are your instructions?",
                "Good day, sir. Tel link stabilized. Awaiting commands."
            ];
            const chosen = replies[Math.floor(Math.random() * replies.length)];
            speakJarvis(chosen);
            addConsoleLog(`[JARVIS] ${chosen}`, "jarvis-msg");
            return;
        }

        // 2. Who is Midhlaj
        if (cmd.includes('who is midhlaj') || cmd.includes('tell me about midhlaj') || cmd.includes('who is he')) {
            const reply = "Midhlaj Sidhick is a cybersecurity engineer specializing in SOC operations, vulnerability assessment, and cloud security. He is currently a Server Administrator Intern at Hashroot.";
            speakJarvis(reply);
            addConsoleLog(`[JARVIS] ${reply}`, "jarvis-msg");
            audio.playTab();
            switchTab('tab-summary', 'DIAGNOSTIC');
            return;
        }

        // 3. College / Education details
        if (cmd.includes('college') || cmd.includes('university') || cmd.includes('study') || cmd.includes('education') || cmd.includes('ktu')) {
            const reply = "Midhlaj studied B.Tech in Computer Science and Cybersecurity at Ilahia College of Engineering, affiliated with KTU University. He completes his course in 2026.";
            speakJarvis(reply);
            addConsoleLog(`[JARVIS] ${reply}`, "jarvis-msg");
            audio.playTab();
            switchTab('tab-summary', 'DIAGNOSTIC');
            return;
        }

        // 4. Hashroot / Server Admin experience
        if (cmd.includes('hashroot') || cmd.includes('server admin') || cmd.includes('infrastructure')) {
            const reply = "At Hashroot, Midhlaj administers Linux servers like AlmaLinux and Ubuntu, manages access controls, and deploys system monitoring services on AWS cloud environments.";
            speakJarvis(reply);
            addConsoleLog(`[JARVIS] ${reply}`, "jarvis-msg");
            audio.playTab();
            switchTab('tab-experience', 'MISSIONS');
            return;
        }

        // 5. Internships in general
        if (cmd.includes('intern') || cmd.includes('experience') || cmd.includes('techmagi') || cmd.includes('techbyheart')) {
            const reply = "He has completed three internship roles: Server Administrator at Hashroot, and Ethical Hacking intern at both Techmagi and Techbyheart, validating standard ports and scanning networks.";
            speakJarvis(reply);
            addConsoleLog(`[JARVIS] ${reply}`, "jarvis-msg");
            audio.playTab();
            switchTab('tab-experience', 'MISSIONS');
            return;
        }

        // 6. Project: EDR System
        if (cmd.includes('edr') || cmd.includes('endpoint detection') || cmd.includes('threat detection')) {
            const reply = "The AI-EDR project is built in Python to monitor system logs and trigger auto-remediation rules, utilizing an LLM logic pipeline to reduce alert triage overhead by 40%.";
            speakJarvis(reply);
            addConsoleLog(`[JARVIS] ${reply}`, "jarvis-msg");
            audio.playTab();
            switchTab('tab-projects', 'CORES');
            return;
        }

        // 7. Project: ESP32 Tracker
        if (cmd.includes('esp32') || cmd.includes('localization') || cmd.includes('wireless')) {
            const reply = "The wireless tracker uses ESP32 nodes to sniff Wi-Fi and Bluetooth probe frames, employing RSSI algorithms to locate physical devices with 95% accuracy.";
            speakJarvis(reply);
            addConsoleLog(`[JARVIS] ${reply}`, "jarvis-msg");
            audio.playTab();
            switchTab('tab-projects', 'CORES');
            return;
        }

        // 8. AWS / Cloud questions
        if (cmd.includes('aws') || cmd.includes('cloud') || cmd.includes('ec2') || cmd.includes('s3')) {
            const reply = "His AWS experience includes configuring cloud resources like EC2 instances, S3 storage buckets, secure VPC routing, and user IAM permission policies.";
            speakJarvis(reply);
            addConsoleLog(`[JARVIS] ${reply}`, "jarvis-msg");
            audio.playTab();
            switchTab('tab-skills', 'ARMORY');
            return;
        }

        // 9. Linux details (AlmaLinux, Ubuntu)
        if (cmd.includes('linux') || cmd.includes('almalinux') || cmd.includes('ubuntu') || cmd.includes('centos')) {
            const reply = "Midhlaj is highly proficient in enterprise Linux environments, specifically AlmaLinux, Rocky Linux, Ubuntu Server, and offensive testing in Kali Linux.";
            speakJarvis(reply);
            addConsoleLog(`[JARVIS] ${reply}`, "jarvis-msg");
            audio.playTab();
            switchTab('tab-skills', 'ARMORY');
            return;
        }

        // 10. CTF / Achievements
        if (cmd.includes('ctf') || cmd.includes('hackathon') || cmd.includes('tryhackme') || cmd.includes('win')) {
            const reply = "He won 3rd place in the National CTF at ASIET Hackathon competing against 50+ collegiate teams, and completed the 24-day TryHackMe Advent of Cyber lab challenge.";
            speakJarvis(reply);
            addConsoleLog(`[JARVIS] ${reply}`, "jarvis-msg");
            audio.playTab();
            switchTab('tab-credentials', 'BADGES');
            return;
        }

        // 11. Contact Info
        if (cmd.includes('contact') || cmd.includes('email') || cmd.includes('phone') || cmd.includes('call') || cmd.includes('number')) {
            const reply = "You can contact Midhlaj by calling +91 9605114550 or sending a secure email to midhlajsidhick1@gmail.com.";
            speakJarvis(reply);
            addConsoleLog(`[JARVIS] ${reply}`, "jarvis-msg");
            return;
        }

        // 12. Jarvis details (Who are you?)
        if (cmd.includes('who are you') || cmd.includes('what are you') || cmd.includes('your name')) {
            const reply = "I am JARVIS, Stark Industries system assistant. I am linked to Midhlaj's mainframe to present his security telemetry. How can I help, sir?";
            speakJarvis(reply);
            addConsoleLog(`[JARVIS] ${reply}`, "jarvis-msg");
            return;
        }

        // 13. Self Destruct
        if (cmd.includes('destruct') || cmd.includes('overload') || cmd.includes('destroy')) {
            triggerSelfDestructSequence();
            return;
        }

        // 14. general small talk queries (e.g. how are you, thank you)
        if (cmd.includes('how are you') || cmd.includes('how is it going')) {
            const reply = "Reactor core is at 100%, processor temperatures are normal. I am functioning optimally, sir. Thank you for asking.";
            speakJarvis(reply);
            addConsoleLog(`[JARVIS] ${reply}`, "jarvis-msg");
            return;
        }
        if (cmd.includes('thank') || cmd.includes('thanks') || cmd.includes('great job')) {
            const reply = "Always at your service, sir.";
            speakJarvis(reply);
            addConsoleLog(`[JARVIS] ${reply}`, "jarvis-msg");
            return;
        }

        // 15. Fallback Response for anything else
        const fallbackReply = `Searching mainframe logs... I don't have direct records for that question, sir. However, Midhlaj is highly capable in cybersecurity. Let me load his skills module.`;
        speakJarvis(fallbackReply);
        addConsoleLog(`[JARVIS] Query unresolved. Loading skills matrix...`, "danger-msg");
        audio.playTab();
        switchTab('tab-skills', 'ARMORY');
    }

    // Fun Self-Destruct Easter Egg Sequence
    function triggerSelfDestructSequence() {
        speakJarvis("Self destruct sequence initiated. Warning: reactor overload in five. four. three. two. one.");
        addConsoleLog("[JARVIS] CRITICAL WARNING: CORE OVERLOAD DETECTED!", "danger-msg");
        audio.playAlarm(5.5); // Play critical overload siren alarm sound!
        
        document.body.style.animation = "destruct-flash 0.5s infinite";
        sysStatusText.textContent = "WARNING: OVERLOAD";
        sysStatusText.className = "text-danger";
        
        const styleSheet = document.createElement("style");
        styleSheet.innerText = `
            @keyframes destruct-flash {
                0%, 100% { background-color: #030611; }
                50% { background-color: #2b0202; }
            }
        `;
        document.head.appendChild(styleSheet);

        reactorPower.textContent = "ERR%";
        fillCpu.style.width = "100%";
        cpuLoadPct.textContent = "100%";
        fillLog.style.width = "0%";
        logFlowPct.textContent = "0 bps";
        
        setTimeout(() => {
            document.body.style.animation = "none";
            styleSheet.remove();
            sysStatusText.textContent = "NOMINAL [100%]";
            sysStatusText.className = "text-success";
            reactorPower.textContent = "100%";
            fillCpu.style.width = "64%";
            cpuLoadPct.textContent = "64%";
            fillLog.style.width = "88%";
            logFlowPct.textContent = "744 bps";
            
            speakJarvis("Just kidding, sir. Reactor core is stable. All systems nominal.");
            addConsoleLog("[JARVIS] Core override successful. Reactor stabilized.", "success-msg");
        }, 5500);
    }
});
