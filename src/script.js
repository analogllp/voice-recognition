const button = document.querySelector("button");
const sendButton = document.querySelector("send");
const icon = document.querySelector("icon");
const text = document.querySelector(".text");
const message = document.querySelector(".message");


let listening = false;
const recognition = createRecognition();
const apiUrl = `http://localhost:6500/get-response?text=`;

button.addEventListener('click', () => {
  if (!recognition) {
    return;
  }

  listening ? recognition.stop() : recognition.start();
})

function createRecognition() {
  const speechRecognition =
    window.speechRecognition || window.webkitSpeechRecognition;
  const recognition =
    speechRecognition !== undefined ? new speechRecognition() : null;

  if (!recognition) {
    text.innerHTML = 'Speech Recognition is not found!';
    return null;
  }

  recognition.lang = 'pt_BR';
  recognition.onstart = () => listening = true;
  recognition.onend = () => listening = false;
  recognition.onerror = error => console.log('error', error);
  recognition.onresult = event => {
    text.innerHTML = event.results[0][0].transcript;
    getResponse(event.results[0][0].transcript);
  };

  return recognition;
}

function getResponse(resp) {
  fetch(`${apiUrl}${resp}`)
    .then(T => T.json())
    .then(value => {
      message.innerHTML = value?.keywords;
    });
}

