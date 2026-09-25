/* =========================================================
   SHAN AI — MAIN SYSTEM CONTROLLER
   ========================================================= */

"use strict";

/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const micBtn = document.getElementById("mic");

const chat = document.getElementById("chat");
const clearChatBtn = document.getElementById("clearChat");

const statusText = document.getElementById("status");
const voiceStatus = document.getElementById("voiceStatus");

const timeElement = document.getElementById("time");
const batteryElement = document.getElementById("battery");
const networkElement = document.getElementById("network");

const wave = document.getElementById("wave");


/* =========================================================
   SHAN CONFIGURATION
   ========================================================= */

const SHAN = {

    name: "SHAN",

    version: "1.0",

    voice: {
        rate: 1.05,
        pitch: 0.9,
        volume: 1
    },

    wakeWords: [
        "hey shan",
        "hi shan",
        "hello shan",
        "shan"
    ]

};


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("SHAN AI INITIALIZING...");

    updateClock();

    setInterval(updateClock, 1000);

    updateNetwork();

    createParticles();

    initializeBattery();

    setupEvents();

    setTimeout(() => {

        setStatus("SYSTEM READY");

    }, 1000);

});


/* =========================================================
   EVENT SYSTEM
   ========================================================= */

function setupEvents() {

    if (sendBtn) {

        sendBtn.addEventListener("click", () => {

            sendCommand();

        });

    }


    if (input) {

        input.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                sendCommand();

            }

        });

    }


    if (clearChatBtn) {

        clearChatBtn.addEventListener("click", clearChat);

    }


    if (micBtn) {

        micBtn.addEventListener("click", () => {

            if (typeof startListening === "function") {

                startListening();

            } else {

                addMessage(
                    "Voice system is not loaded yet.",
                    "shan"
                );

            }

        });

    }


    /* Network events */

    window.addEventListener(
        "online",
        updateNetwork
    );

    window.addEventListener(
        "offline",
        updateNetwork
    );

}


/* =========================================================
   SEND COMMAND
   ========================================================= */

function sendCommand() {

    if (!input) return;

    const command = input.value.trim();

    if (!command) return;


    /* Show user message */

    addMessage(
        command,
        "user"
    );


    /* Clear input */

    input.value = "";


    /* Process */

    processCommand(command);

}


/* =========================================================
   COMMAND PROCESSOR
   ========================================================= */

async function processCommand(command) {

    const text = command
        .toLowerCase()
        .trim();


    setStatus("PROCESSING...");

    activateCore();


    /* Small thinking delay */

    await delay(350);


    /* =====================================================
       GREETINGS
       ===================================================== */

    if (
        text === "hi" ||
        text === "hello" ||
        text.includes("hello shan") ||
        text.includes("hi shan") ||
        text.includes("hey shan")
    ) {

        respond(
            "Hello. SHAN artificial intelligence is online. How can I assist you?"
        );

        return;
    }


    /* =====================================================
       IDENTITY
       ===================================================== */

    if (
        text.includes("who are you") ||
        text.includes("what are you") ||
        text.includes("your name")
    ) {

        respond(
            "I am SHAN, your personal artificial intelligence assistant."
        );

        return;
    }


    /* =====================================================
       TIME
       ===================================================== */

    if (
        text.includes("time") ||
        text.includes("current time")
    ) {

        const now = new Date();

        const time = now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

        respond(
            `The current time is ${time}.`
        );

        return;
    }


    /* =====================================================
       DATE
       ===================================================== */

    if (
        text.includes("date") ||
        text.includes("today")
    ) {

        const now = new Date();

        const date = now.toLocaleDateString(
            [],
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

        respond(
            `Today is ${date}.`
        );

        return;
    }


    /* =====================================================
       DAY
       ===================================================== */

    if (text.includes("what day")) {

        const day = new Date().toLocaleDateString(
            [],
            {
                weekday: "long"
            }
        );

        respond(
            `Today is ${day}.`
        );

        return;
    }


    /* =====================================================
       GOOGLE
       ===================================================== */

    if (
        text === "google" ||
        text.includes("open google")
    ) {

        respond(
            "Opening Google."
        );

        openWebsite(
            "https://www.google.com"
        );

        return;
    }


    /* =====================================================
       YOUTUBE
       ===================================================== */

    if (
        text === "youtube" ||
        text.includes("open youtube")
    ) {

        respond(
            "Opening YouTube."
        );

        openWebsite(
            "https://www.youtube.com"
        );

        return;
    }


    /* =====================================================
       WHATSAPP
       ===================================================== */

    if (
        text.includes("open whatsapp")
    ) {

        respond(
            "Opening WhatsApp."
        );

        openAppOrWebsite(
            "whatsapp://",
            "https://web.whatsapp.com"
        );

        return;
    }


    /* =====================================================
       GMAIL
       ===================================================== */

    if (
        text.includes("open gmail") ||
        text.includes("open mail")
    ) {

        respond(
            "Opening Gmail."
        );

        openWebsite(
            "https://mail.google.com"
        );

        return;
    }


    /* =====================================================
       GOOGLE MAPS
       ===================================================== */

    if (
        text.includes("open maps") ||
        text.includes("google maps")
    ) {

        respond(
            "Opening Google Maps."
        );

        openWebsite(
            "https://maps.google.com"
        );

        return;
    }


    /* =====================================================
       SPOTIFY
       ===================================================== */

    if (
        text.includes("open spotify")
    ) {

        respond(
            "Opening Spotify."
        );

        openAppOrWebsite(
            "spotify://",
            "https://open.spotify.com"
        );

        return;
    }


    /* =====================================================
       INSTAGRAM
       ===================================================== */

    if (
        text.includes("open instagram")
    ) {

        respond(
            "Opening Instagram."
        );

        openAppOrWebsite(
            "instagram://",
            "https://www.instagram.com"
        );

        return;
    }


    /* =====================================================
       FACEBOOK
       ===================================================== */

    if (
        text.includes("open facebook")
    ) {

        respond(
            "Opening Facebook."
        );

        openWebsite(
            "https://www.facebook.com"
        );

        return;
    }


    /* =====================================================
       CAMERA
       ===================================================== */

    if (
        text.includes("open camera")
    ) {

        respond(
            "Camera access requires a camera module. We can add that in a later SHAN upgrade."
        );

        return;
    }


    /* =====================================================
       SEARCH
       ===================================================== */

    if (
        text.startsWith("search ")
    ) {

        const query = command
            .substring(7)
            .trim();

        if (query) {

            respond(
                `Searching the web for ${query}.`
            );

            const url =
                "https://www.google.com/search?q=" +
                encodeURIComponent(query);

            openWebsite(url);

        }

        return;
    }


    /* =====================================================
       YOUTUBE SEARCH
       ===================================================== */

    if (
        text.startsWith("play ") ||
        text.startsWith("youtube ")
    ) {

        let query = "";

        if (text.startsWith("play ")) {

            query = command
                .substring(5)
                .trim();

        } else {

            query = command
                .substring(8)
                .trim();

        }


        if (query) {

            respond(
                `Searching YouTube for ${query}.`
            );

            const url =
                "https://www.youtube.com/results?search_query=" +
                encodeURIComponent(query);

            openWebsite(url);

        }

        return;
    }


    /* =====================================================
       BATTERY
       ===================================================== */

    if (
        text.includes("battery")
    ) {

        const battery = batteryElement
            ? batteryElement.textContent
            : "unknown";

        respond(
            `Current battery level is ${battery}.`
        );

        return;
    }


    /* =====================================================
       NETWORK
       ===================================================== */

    if (
        text.includes("internet") ||
        text.includes("network") ||
        text.includes("online")
    ) {

        const state =
            navigator.onLine
                ? "online"
                : "offline";

        respond(
            `Network connection is currently ${state}.`
        );

        return;
    }


    /* =====================================================
       JOKE
       ===================================================== */

    if (
        text.includes("joke")
    ) {

        const jokes = [

            "Why did the computer get cold? Because it left its Windows open.",

            "I told my processor a joke. It needed a moment to process it.",

            "Why was the smartphone wearing glasses? Because it lost its contacts."

        ];

        const joke =
            jokes[
                Math.floor(
                    Math.random() *
                    jokes.length
                )
            ];

        respond(joke);

        return;
    }


    /* =====================================================
       THANK YOU
       ===================================================== */

    if (
        text.includes("thank you") ||
        text.includes("thanks")
    ) {

        respond(
            "You're welcome. SHAN systems remain ready."
        );

        return;
    }


    /* =====================================================
       GOODBYE
       ===================================================== */

    if (
        text.includes("goodbye") ||
        text.includes("bye")
    ) {

        respond(
            "Until next time. SHAN system standing by."
        );

        return;
    }


    /* =====================================================
       SYSTEM STATUS
       ===================================================== */

    if (
        text.includes("system status") ||
        text.includes("status report")
    ) {

        respond(
            "All primary SHAN systems are operational. AI core online. Network monitoring active. Voice interface ready."
        );

        return;
    }


    /* =====================================================
       CLEAR CHAT
       ===================================================== */

    if (
        text.includes("clear chat") ||
        text.includes("clear conversation")
    ) {

        clearChat();

        respond(
            "Communication log cleared."
        );

        return;
    }


   /* =====================================================
   AI FALLBACK
   ===================================================== */

if (typeof askAIAndRespond === "function") {

    askAIAndRespond(command);

} else {

    respond(
        "SHAN AI intelligence module is not available."
    );

}

}


/* =========================================================
   SHAN RESPONSE
   ========================================================= */

function respond(message) {

    addMessage(
        message,
        "shan"
    );

    setStatus("RESPONDING...");

    speakText(message);

    setTimeout(() => {

        setStatus("SYSTEM READY");

        deactivateCore();

    }, 1500);

}


/* =========================================================
   ADD CHAT MESSAGE
   ========================================================= */

function addMessage(message, type = "shan") {

    if (!chat) return;


    const wrapper =
        document.createElement("div");

    wrapper.className =
        type === "user"
            ? "message user-message"
            : "message shan-message";


    const tag =
        document.createElement("div");

    tag.className =
        "message-tag";

    tag.textContent =
        type === "user"
            ? "YOU"
            : "SHAN";


    const text =
        document.createElement("p");

    text.textContent = message;


    wrapper.appendChild(tag);

    wrapper.appendChild(text);

    chat.appendChild(wrapper);


    /* Scroll to bottom */

    chat.scrollTop =
        chat.scrollHeight;

}


/* =========================================================
   TEXT TO SPEECH
   ========================================================= */

function speakText(text) {

    /*
       Android browsers normally provide
       speechSynthesis.

       Check before using it so SHAN
       doesn't crash if unavailable.
    */

    if (
        typeof window === "undefined" ||
        !("speechSynthesis" in window)
    ) {

        console.warn(
            "Speech synthesis unavailable."
        );

        return;
    }


    try {

        window.speechSynthesis.cancel();


        const utterance =
            new SpeechSynthesisUtterance(text);


        utterance.rate =
            SHAN.voice.rate;

        utterance.pitch =
            SHAN.voice.pitch;

        utterance.volume =
            SHAN.voice.volume;


        utterance.onstart = () => {

            setStatus("SPEAKING...");

            if (voiceStatus) {

                voiceStatus.textContent =
                    "SHAN IS SPEAKING";

            }

            activateWave();

        };


        utterance.onend = () => {

            setStatus("SYSTEM READY");

            if (voiceStatus) {

                voiceStatus.textContent =
                    'SAY "HEY SHAN"';

            }

            deactivateWave();

        };


        utterance.onerror = () => {

            setStatus("VOICE READY");

            deactivateWave();

        };


        window.speechSynthesis.speak(
            utterance
        );

    } catch (error) {

        console.error(
            "Speech error:",
            error
        );

    }

}


/* =========================================================
   OPEN WEBSITE
   ========================================================= */

function openWebsite(url) {

    window.location.href = url;

}


/* =========================================================
   OPEN APP / FALLBACK WEBSITE
   ========================================================= */

function openAppOrWebsite(
    appUrl,
    websiteUrl
) {

    const startTime =
        Date.now();


    window.location.href =
        appUrl;


    /*
       If the Android app doesn't
       open, fall back to website.
    */

    setTimeout(() => {

        const elapsed =
            Date.now() - startTime;


        if (elapsed < 1500) {

            window.location.href =
                websiteUrl;

        }

    }, 1000);

}


/* =========================================================
   QUICK COMMAND
   ========================================================= */

function quickCommand(command) {

    if (!input) return;

    input.value = command;

    sendCommand();

}


/* =========================================================
   CLEAR CHAT
   ========================================================= */

function clearChat() {

    if (!chat) return;

    chat.innerHTML = "";

    addMessage(
        "Communication log cleared. SHAN is ready.",
        "shan"
    );

}


/* =========================================================
   CLOCK
   ========================================================= */

function updateClock() {

    if (!timeElement) return;


    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );


    timeElement.textContent =
        time;

}


/* =========================================================
   NETWORK
   ========================================================= */

function updateNetwork() {

    if (!networkElement) return;


    if (navigator.onLine) {

        networkElement.textContent =
            "ONLINE";

        networkElement.style.color =
            "#ff3333";

    } else {

        networkElement.textContent =
            "OFFLINE";

        networkElement.style.color =
            "#777";

    }

}


/* =========================================================
   BATTERY
   ========================================================= */

async function initializeBattery() {

    if (!batteryElement) return;


    if (
        !navigator.getBattery
    ) {

        batteryElement.textContent =
            "N/A";

        return;

    }


    try {

        const battery =
            await navigator.getBattery();


        function updateBattery() {

            const level =
                Math.round(
                    battery.level * 100
                );


            batteryElement.textContent =
                level + "%";


            if (
                level <= 20
            ) {

                batteryElement.style.color =
                    "#ff3333";

            } else {

                batteryElement.style.color =
                    "#eee";

            }

        }


        updateBattery();


        battery.addEventListener(
            "levelchange",
            updateBattery
        );


        battery.addEventListener(
            "chargingchange",
            updateBattery
        );

    } catch (error) {

        batteryElement.textContent =
            "N/A";

    }

}


/* =========================================================
   CORE ANIMATION
   ========================================================= */

function activateCore() {

    document.body.classList.add(
        "alert-mode"
    );

    activateWave();

}


function deactivateCore() {

    document.body.classList.remove(
        "alert-mode"
    );

    deactivateWave();

}


/* =========================================================
   VOICE WAVE
   ========================================================= */

function activateWave() {

    if (!wave) return;

    wave.classList.add(
        "active"
    );

}


function deactivateWave() {

    if (!wave) return;

    wave.classList.remove(
        "active"
    );

}


/* =========================================================
   STATUS
   ========================================================= */

function setStatus(text) {

    if (!statusText) return;

    statusText.textContent =
        text;

}


/* =========================================================
   PARTICLE ENGINE
   ========================================================= */

function createParticles() {

    const container =
        document.getElementById(
            "particles"
        );


    if (!container) return;


    const amount =
        window.innerWidth < 600
            ? 35
            : 60;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const particle =
            document.createElement("div");


        particle.className =
            "particle";


        particle.style.left =
            Math.random() * 100 +
            "%";


        particle.style.animationDuration =
            5 +
            Math.random() * 10 +
            "s";


        particle.style.animationDelay =
            Math.random() * 10 +
            "s";


        particle.style.opacity =
            Math.random();


        container.appendChild(
            particle
        );

    }

}


/* =========================================================
   DELAY
   ========================================================= */

function delay(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}


/* =========================================================
   GLOBAL SHAN API
   ========================================================= */

window.SHAN = {

    speak: speakText,

    respond: respond,

    command: processCommand,

    clearChat: clearChat,

    status: setStatus,

    activate: activateCore,

    deactivate: deactivateCore

};


/* =========================================================
   CONSOLE
   ========================================================= */

console.log(
    "%c SHAN AI ONLINE ",
    "background:#180000;color:#ff3333;font-size:18px;font-weight:bold;padding:8px;"
);

console.log(
    "SHAN Core Version:",
    SHAN.version
);
