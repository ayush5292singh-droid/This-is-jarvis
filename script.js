// =====================================================
// J.A.R.V.I.S
// VOICE + CONVERSATION + WEB + CALCULATOR
// =====================================================


const app =
  document.getElementById("app");

const orb =
  document.getElementById("orb");

const status =
  document.getElementById("status");

const chat =
  document.getElementById("chat");

const input =
  document.getElementById("commandInput");

const mic =
  document.getElementById("micButton");

const send =
  document.getElementById("sendButton");

const hidden =
  document.getElementById("hiddenScreen");

const show =
  document.getElementById("showButton");


// =====================================================
// VOICE ENGINE
// =====================================================

let selectedVoice = null;


function loadVoices() {

  if (!window.speechSynthesis) {
    return;
  }

  const voices =
    speechSynthesis.getVoices();

  if (!voices.length) {
    return;
  }


  // Prefer English voices

  selectedVoice =
    voices.find(v =>
      v.lang === "en-IN"
    ) ||

    voices.find(v =>
      v.lang === "en-US"
    ) ||

    voices.find(v =>
      v.lang.startsWith("en")
    ) ||

    voices[0];
}


loadVoices();


if ("speechSynthesis" in window) {

  speechSynthesis.onvoiceschanged =
    loadVoices;
}


// =====================================================
// SPEAK
// =====================================================

function speak(text) {

  if (!("speechSynthesis" in window)) {
    return;
  }


  speechSynthesis.cancel();


  const utterance =
    new SpeechSynthesisUtterance(text);


  if (selectedVoice) {
    utterance.voice =
      selectedVoice;
  }


  utterance.lang =
    selectedVoice?.lang ||
    "en-IN";


  utterance.rate =
    0.88;

  utterance.pitch =
    0.82;

  utterance.volume =
    1;


  app.classList.remove(
    "listening"
  );

  app.classList.add(
    "speaking"
  );


  status.textContent =
    "SPEAKING";


  utterance.onend =
    function() {

      app.classList.remove(
        "speaking"
      );

      status.textContent =
        "STANDBY";
    };


  utterance.onerror =
    function() {

      app.classList.remove(
        "speaking"
      );

      status.textContent =
        "STANDBY";
    };


  speechSynthesis.speak(
    utterance
  );
}


// =====================================================
// CHAT
// =====================================================

function addUserMessage(text) {

  const box =
    document.createElement("div");

  box.className =
    "user-message";

  box.innerHTML =
    `<span class="speaker">YOU</span>
     ${escapeHTML(text)}`;

  chat.appendChild(box);

  chat.scrollTop =
    chat.scrollHeight;
}


function addJarvisMessage(text) {

  const box =
    document.createElement("div");

  box.className =
    "jarvis-message";

  box.innerHTML =
    `<span class="speaker">JARVIS</span>
     ${escapeHTML(text)}`;

  chat.appendChild(box);

  chat.scrollTop =
    chat.scrollHeight;
}


function escapeHTML(text) {

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


// =====================================================
// RESPONSE
// =====================================================

function respond(text) {

  addJarvisMessage(text);

  speak(text);
}


// =====================================================
// SEARCH GOOGLE
// =====================================================

function searchGoogle(query) {

  query =
    query.trim();

  if (!query) {

    respond(
      "Please tell me what you would like me to search."
    );

    return;
  }


  addJarvisMessage(
    "Searching Google for " +
    query + "."
  );


  speak(
    "Searching Google for " +
    query
  );


  const url =
    "https://www.google.com/search?q=" +
    encodeURIComponent(query);


  // Give the voice a moment to start.

  setTimeout(
    function() {

      window.location.assign(url);

    },
    700
  );
}


// =====================================================
// WEBSITE LIST
// =====================================================

const websites = {

  google:
    "https://www.google.com",

  youtube:
    "https://www.youtube.com",

  chatgpt:
    "https://chatgpt.com",

  github:
    "https://github.com",

  instagram:
    "https://www.instagram.com",

  facebook:
    "https://www.facebook.com",

  wikipedia:
    "https://www.wikipedia.org",

  gmail:
    "https://mail.google.com",

  reddit:
    "https://www.reddit.com",

  nasa:
    "https://www.nasa.gov",

  amazon:
    "https://www.amazon.in",

  pw:
    "https://www.pw.live",

  "physics wallah":
    "https://www.pw.live"
};


// =====================================================
// OPEN WEBSITE
// =====================================================

function openWebsite(name) {

  name =
    name.trim();


  if (!name) {

    respond(
      "Which website would you like me to open?"
    );

    return;
  }


  const key =
    name.toLowerCase();


  // Known website

  if (websites[key]) {

    addJarvisMessage(
      "Opening " +
      name +
      "."
    );


    speak(
      "Opening " +
      name
    );


    setTimeout(
      function() {

        window.location.assign(
          websites[key]
        );

      },
      700
    );

    return;
  }


  // Direct URL

  let url =
    name;


  if (
    !url.startsWith("http://") &&
    !url.startsWith("https://")
  ) {

    url =
      "https://" + url;
  }


  if (
    name.includes(".") ||
    name.startsWith("http://") ||
    name.startsWith("https://")
  ) {

    addJarvisMessage(
      "Opening " +
      name +
      "."
    );


    speak(
      "Opening " +
      name
    );


    setTimeout(
      function() {

        window.location.assign(url);

      },
      700
    );

    return;
  }


  // Unknown website

  addJarvisMessage(
    "I will find " +
    name +
    " for you."
  );


  speak(
    "I will find " +
    name +
    " for you."
  );


  setTimeout(
    function() {

      searchGoogle(
        name +
        " official website"
      );

    },
    700
  );
}


// =====================================================
// CALCULATOR
// =====================================================

function calculator(text) {

  let expression =
    text.toLowerCase();


  // Percentage

  const percent =
    expression.match(
      /([0-9.]+)\s*%\s*(?:of)\s*([0-9.]+)/
    );


  if (percent) {

    const a =
      Number(percent[1]);

    const b =
      Number(percent[2]);

    const result =
      (a / 100) * b;


    respond(
      `${a} percent of ${b} is ${result}.`
    );

    return;
  }


  // Square root

  const sqrt =
    expression.match(
      /square root of\s+([0-9.]+)/
    );


  if (sqrt) {

    const number =
      Number(sqrt[1]);

    const result =
      Math.sqrt(number);


    respond(
      `The square root of ${number} is ${result}.`
    );

    return;
  }


  // Power

  expression =
    expression
      .replace(
        /to the power of/gi,
        "**"
      )
      .replace(
        /to the power/gi,
        "**"
      );


  // Spoken operators

  expression =
    expression
      .replace(/times/gi, "*")
      .replace(/multiplied by/gi, "*")
      .replace(/plus/gi, "+")
      .replace(/minus/gi, "-")
      .replace(/divided by/gi, "/");


  // Security check

  if (
    !/^[0-9+\-*/().%\s]+$/
      .test(expression)
  ) {

    searchGoogle(text);

    return;
  }


  try {

    const result =
      Function(
        '"use strict"; return (' +
        expression +
        ')'
      )();


    respond(
      `${expression} equals ${result}.`
    );

  }

  catch {

    searchGoogle(text);

  }
}


// =====================================================
// TIME
// =====================================================

function tellTime() {

  const time =
    new Date().toLocaleTimeString(
      [],
      {
        hour: "numeric",
        minute: "2-digit"
      }
    );


  respond(
    `The current time is ${time}.`
  );
}


// =====================================================
// DATE
// =====================================================

function tellDate() {

  const date =
    new Date().toLocaleDateString(
      [],
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    );


  respond(
    `Today is ${date}.`
  );
}


// =====================================================
// BASIC CONVERSATION
// =====================================================

function conversationEngine(text) {

  const t =
    text.toLowerCase().trim();


  if (
    /^(hi|hello|hey)$/.test(t)
  ) {

    respond(
      "Hello. It's good to hear from you. How can I assist you?"
    );

    return true;
  }


  if (
    t.includes("how are you")
  ) {

    respond(
      "All systems are operating normally. Thank you for asking."
    );

    return true;
  }


  if (
    t.includes("your name")
  ) {

    respond(
      "I am JARVIS, your virtual assistant."
    );

    return true;
  }


  if (
    t.includes("what can you do")
  ) {

    respond(
      "I can converse with you, listen to voice commands, search Google, open websites, calculate numbers, tell you the time and date, and control this JARVIS interface."
    );

    return true;
  }


  if (
    t.includes("thank you") ||
    t === "thanks"
  ) {

    respond(
      "You're welcome. Always happy to help."
    );

    return true;
  }


  if (
    t.includes("who made you")
  ) {

    respond(
      "I am a browser-based JARVIS assistant designed to help you."
    );

    return true;
  }


  if (
    t === "bye" ||
    t === "goodbye"
  ) {

    respond(
      "Goodbye. I'll be here when you need me."
    );

    return true;
  }


  if (
    t === "good" ||
    t === "nice" ||
    t === "great"
  ) {

    respond(
      "Excellent. What would you like to do next?"
    );

    return true;
  }


  return false;
}


// =====================================================
// HIDE
// =====================================================

function hideJarvis() {

  speechSynthesis.cancel();

  app.style.display =
    "none";

  hidden.style.display =
    "flex";
}


// =====================================================
// SHOW
// =====================================================

function showJarvis() {

  hidden.style.display =
    "none";

  app.style.display =
    "block";

  respond(
    "JARVIS systems restored."
  );
}


// =====================================================
// COMMAND PROCESSOR
// =====================================================

function executeCommand(raw) {

  let text =
    raw.trim();

  if (!text) return;


  addUserMessage(text);


  // Remove wake word

  text =
    text.replace(
      /^hey\s+jarvis[\s,]*/i,
      ""
    );

  text =
    text.replace(
      /^jarvis[\s,]*/i,
      ""
    );


  const lower =
    text.toLowerCase().trim();


  if (!lower) {

    respond(
      "Yes. I'm listening."
    );

    return;
  }


  // OPEN

  if (
    lower.startsWith("open ")
  ) {

    openWebsite(
      text.substring(5)
    );

    return;
  }


  // SEARCH GOOGLE

  if (
    lower.startsWith(
      "search google "
    )
  ) {

    searchGoogle(
      text.substring(14)
    );

    return;
  }


  // SEARCH

  if (
    lower.startsWith("search ")
  ) {

    searchGoogle(
      text.substring(7)
    );

    return;
  }


  // CALCULATE

  if (
    lower.startsWith("calculate ")
  ) {

    calculator(
      text.substring(10)
    );

    return;
  }


  // TIME

  if (
    lower === "time" ||
    lower.includes("what time is it")
  ) {

    tellTime();

    return;
  }


  // DATE

  if (
    lower === "date" ||
    lower.includes("what is today's date") ||
    lower.includes("what day is it")
  ) {

    tellDate();

    return;
  }


  // BACK

  if (
    lower === "go back" ||
    lower === "back"
  ) {

    respond(
      "Going back."
    );


    setTimeout(
      function() {
        history.back();
      },
      600
    );

    return;
  }


  // DISAPPEAR

  if (
    lower === "disappear" ||
    lower === "go away" ||
    lower === "hide yourself"
  ) {

    hideJarvis();

    return;
  }


  // SHOW

  if (
    lower === "show yourself" ||
    lower === "come back"
  ) {

    showJarvis();

    return;
  }


  // STOP

  if (
    lower === "stop" ||
    lower === "stop speaking"
  ) {

    speechSynthesis.cancel();

    app.classList.remove(
      "speaking"
    );

    status.textContent =
      "STANDBY";

    addJarvisMessage(
      "Speech stopped."
    );

    return;
  }


  // CONVERSATION

  if (
    conversationEngine(text)
  ) {

    return;
  }


  // EVERYTHING ELSE = GOOGLE

  searchGoogle(text);
}


// =====================================================
// SEND
// =====================================================

send.addEventListener(
  "click",
  function() {

    const text =
      input.value.trim();

    if (!text) return;

    executeCommand(text);

    input.value = "";

  }
);


// =====================================================
// ENTER
// =====================================================

input.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key === "Enter"
    ) {

      event.preventDefault();

      send.click();

    }

  }
);


// =====================================================
// SPEECH RECOGNITION
// =====================================================

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;


let recognition =
  null;

let listening =
  false;


if (SpeechRecognition) {

  recognition =
    new SpeechRecognition();


  recognition.lang =
    "en-IN";


  recognition.continuous =
    false;


  recognition.interimResults =
    true;


  recognition.onstart =
    function() {

      listening = true;

      app.classList.remove(
        "speaking"
      );

      app.classList.add(
        "listening"
      );

      status.textContent =
        "LISTENING";

      input.value = "";

    };


  recognition.onresult =
    function(event) {

      let transcript =
        "";


      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {

        transcript +=
          event.results[i][0]
            .transcript;
      }


      transcript =
        transcript.trim();


      // LIVE SPEECH → TEXT BOX

      input.value =
        transcript;


      const lastResult =
        event.results[
          event.results.length - 1
        ];


      // FINAL SPEECH
      // AUTOMATICALLY EXECUTES

      if (
        lastResult.isFinal &&
        transcript
      ) {

        executeCommand(
          transcript
        );

        input.value = "";

      }

    };


  recognition.onerror =
    function(event) {

      console.log(
        "Speech error:",
        event.error
      );


      app.classList.remove(
        "listening"
      );

      status.textContent =
        "STANDBY";


      if (
        event.error ===
        "not-allowed"
      ) {

        addJarvisMessage(
          "Microphone permission is blocked. Please allow microphone access for JARVIS."
        );

      }

      else if (
        event.error ===
        "no-speech"
      ) {

        addJarvisMessage(
          "I didn't hear anything. Please try again."
        );

      }

      else {

        addJarvisMessage(
          "I couldn't process the voice command."
        );
      }

    };


  recognition.onend =
    function() {

      listening = false;

      app.classList.remove(
        "listening"
      );

      if (
        !app.classList.contains(
          "speaking"
        )
      ) {

        status.textContent =
          "STANDBY";
      }

    };

}


// =====================================================
// START LISTENING
// =====================================================

function startListening() {

  if (!recognition) {

    addJarvisMessage(
      "Voice recognition is not available in this browser."
    );

    return;
  }


  if (listening) {

    recognition.stop();

    return;
  }


  try {

    // Make sure speech engine is ready

    if (
      "speechSynthesis" in window
    ) {

      speechSynthesis.cancel();

    }


    recognition.start();

  }

  catch(error) {

    console.log(error);

  }
}


// =====================================================
// MIC
// =====================================================

mic.addEventListener(
  "click",
  startListening
);


// =====================================================
// CORE
// =====================================================

orb.addEventListener(
  "click",
  startListening
);


// =====================================================
// SHOW
// =====================================================

show.addEventListener(
  "click",
  showJarvis
);


// =====================================================
// STARTUP
// =====================================================

console.log(
  "J.A.R.V.I.S online."
);
