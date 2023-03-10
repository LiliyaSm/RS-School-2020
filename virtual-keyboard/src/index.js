import "./scss/style.scss";
import language from "./layouts/layout.js"; // { en, ru }
import create from "./layouts/create.js"; // creates DOM elements

const rowsOrder = [
    [
        "Backquote",
        "Digit1",
        "Digit2",
        "Digit3",
        "Digit4",
        "Digit5",
        "Digit6",
        "Digit7",
        "Digit8",
        "Digit9",
        "Digit0",
        "Minus",
        "Equal",
        "Done",
    ],
    [
        "Tab",
        "KeyQ",
        "KeyW",
        "KeyE",
        "KeyR",
        "KeyT",
        "KeyY",
        "KeyU",
        "KeyI",
        "KeyO",
        "KeyP",
        "BracketLeft",
        "BracketRight",
        "Backspace",
    ],
    [
        "CapsLock",
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyG",
        "KeyH",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
        "Quote",
        "Backslash",
        "Enter",
    ],
    [
        "ShiftLeft",
        "Sound",
        "KeyZ",
        "KeyX",
        "KeyC",
        "KeyV",
        "KeyB",
        "KeyN",
        "KeyM",
        "Comma",
        "Period",
        "Slash",
        "ArrowUp",
        "ShiftRight",
    ],
    [
        "ControlLeft",
        "Lang",
        "AltLeft",
        "Speech",
        "Space",
        "AltRight",
        "ControlRight",
        "ArrowLeft",
        "ArrowDown",
        "ArrowRight",
    ],
];

const speechLang = { ru: "ru-RU", en: "en-US" };
const sounds = [
    "allBtns.wav",
    "rus.wav",
    "Enter.wav",
    "CapsLock.wav",
    "Backspace.wav",
    "Shift.wav",
];

const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
        inputField: null,
        title: null,
        text: null,
    },

    eventHandlers: {
        oninput: null,
        onclose: null,
    },

    keyLayout: null,

    recognition: null,
    speechIsOn: false,
    soundIsOn: false,

    properties: {
        value: "",
        capsLock: false,
        shift: false,
        lang: null,
    },

    init(langCode) {
        this.keyLayout = language[langCode];
        // this.lang = langCode;
        this.properties.lang = langCode;

        this.elements.main = create(
            "div",
            ["keyboard", "keyboard--hidden"],
            document.body
        );
        this.elements.keysContainer = create(
            "div",
            ["keyboard__keys"],
            this.elements.main
        );
        let inputContainer = create("div", ["input-container"], document.body);
        this.elements.title = create("h1", null, inputContainer);
        this.elements.inputField = create(
            "textarea",
            ["use-keyboard-input"],
            inputContainer,
            ["placeholder", "Enter text"],
            ["cols", "120"]
        );

        this.elements.text = create("span", ["text"], document.body);

        let audios = this.createAudio();
        document.body.appendChild(audios);

        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.title.textContent = "Virtual keyboard";

        this.elements.keys = this.elements.keysContainer.querySelectorAll(
            ".keyboard__key"
        );

        this.elements.keys.forEach((key) => {
            let code = key.getAttribute("data-code");
            let keyObj = this.keyLayout.find((keyL) => keyL.code === code);
            let isFuncButton = keyObj.shift ? false : true;

            if (!isFuncButton) {
                key.classList.add("fs20");
            }
        });

        //voice input
        const SpeechRecognition =
            window.speechRecognition || window.webkitSpeechRecognition;

        let recognition = new SpeechRecognition();

        recognition.continuous = true;
        // recognition lang "en-US";
        recognition.lang = speechLang[this.lang];
        recognition.onstart = function () {
            console.log("Recognition started");
        };

        recognition.onerror = function (e) {
            console.log("Error");
        };

        recognition.addEventListener("end", (e) => {
            // recognition.start();
            this.elements.keysContainer
                .querySelector(`[data-code*="Speech"]`)
                .classList.remove("keyboard__key--dark");
            console.log("Speech recognition ended");
        });

        recognition.addEventListener("result", (e) => {
            if (e.results.length > 0) {
                let inputSpeech = e.results[e.results.length - 1][0].transcript;
                this.characterInput(inputSpeech, inputSpeech.length);
                this._triggerEvent("oninput");
            }
        });

        this.recognition = recognition;

        document.addEventListener("keydown", (e) => {
            if (e.which == 20 || e.keyCode == 20) {
                this._toggleCapsLock();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.shiftKey) {
                this._toggleShift();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.altKey) {
                e.preventDefault();
            }
        });

        window.addEventListener("keydown", (event) => {
            let pressedBtn = document.querySelector(
                `[data-code= ${event.code}]`
            );

            if (!pressedBtn) return
            
            pressedBtn.classList.add("pressed-button");

            let keyObj = this.keyLayout.find((key) => key.code === event.code);

            //check if button is Ctrl, SHIFT and other
            let isFuncButton = keyObj.shift ? false : true;

            if (!isFuncButton) {
                let symbol = pressedBtn.textContent;
                event.preventDefault();
                this.characterInput(symbol);
            }
        });

        window.addEventListener("keyup", (event) => {
            let pressedBtn = document.querySelector(
                `[data-code= ${event.code}]`
            );
            if (pressedBtn) pressedBtn.classList.remove("pressed-button");

            //synchronization after entering by physical keyboard
            this.properties.value = document.querySelector(
                ".use-keyboard-input"
            ).value;
        });

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach((element) => {
            element.addEventListener("focus", () => {
                this.open(element.value, (currentValue) => {
                    element.value = currentValue;
                });
            });
        });
    },

    createAudio() {
        const fragment = document.createDocumentFragment();
        sounds.forEach((sound) => {
            let audio = document.createElement("audio");
            audio.setAttribute("src", `./assets/sounds/${sound}`);
            fragment.appendChild(audio);
        });

        return fragment;
    },

    playSound(code) {
        if (!this.soundIsOn) return;
        let audio = document.querySelector(`audio[src*=${code}]`);
        if (code.includes("Shift")) {
            audio = document.querySelector(`audio[src*="Shift"]`);
        }
        if (!audio) {
            if (this.properties.lang === "en") {
                audio = document.querySelector(`audio[src*="allBtns"]`);
            } else {
                audio = document.querySelector(`audio[src*="rus"]`);
            }
        }
        audio.currentTime = 0;
        audio.play();
    },

    addAnimation(serviceStatus, service) {
        if (this.elements.text.classList.contains("zoom")) {
            this.elements.text.classList.remove("zoom");
        }
        //force browser to play animation again, set to null styles
        void this.elements.text.offsetWidth;

        if (serviceStatus) {
            this.elements.text.textContent = `${service} is on`;
            this.elements.text.classList.add("zoom");
        } else {
            this.elements.text.textContent = `${service} is off`;
            this.elements.text.classList.add("zoom");
        }
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        rowsOrder.forEach((row, i) => {
            let div = document.createElement("div");

            row.forEach((code) => {
                let keyElement = document.createElement("button");
                keyElement.addEventListener("click", (e) => {
                    this.playSound(code);
                });

                keyElement.setAttribute("type", "button");
                keyElement.classList.add("keyboard__key");

                let keyObj = this.keyLayout.find((key) => key.code === code);

                if (keyObj) {
                    keyElement.setAttribute("data-code", keyObj.code);

                    //text on buttons
                    keyElement = this.changeInnerHTML(keyElement, keyObj);

                    switch (keyObj.code) {
                        case "Backspace":
                            keyElement.classList.add("keyboard__key--wide");

                            keyElement.addEventListener("click", () => {
                                let caretPos = this.elements.inputField
                                    .selectionStart;
                                let str = this.properties.value;

                                let selectionText = document
                                    .getSelection()
                                    .toString();

                                if (selectionText) {
                                    const start = this.elements.inputField
                                        .selectionStart;
                                    const end = this.elements.inputField
                                        .selectionEnd;
                                    this.properties.value =
                                        str.substring(0, start) +
                                        str.substring(end);
                                    this._triggerEvent("oninput");

                                    this.elements.inputField.focus();

                                    this.elements.inputField.setSelectionRange(
                                        caretPos,
                                        caretPos
                                    );
                                } else {
                                    this.elements.inputField.focus();
                                    this.properties.value =
                                        str.substring(0, caretPos - 1) +
                                        str.substring(caretPos);
                                    this._triggerEvent("oninput");

                                    this.elements.inputField.setSelectionRange(
                                        caretPos - 1,
                                        caretPos - 1
                                    );
                                }
                            });

                            break;

                        case "ArrowLeft":
                            keyElement.addEventListener("click", () => {
                                let caretPos = this.elements.inputField
                                    .selectionStart;
                                caretPos = caretPos - 1 >= 0 ? caretPos - 1 : 0;
                                this.elements.inputField.focus();
                                this.elements.inputField.setSelectionRange(
                                    caretPos,
                                    caretPos
                                );
                            });

                            break;

                        case "Sound":
                            keyElement.innerHTML = createIconHTML("campaign");

                            keyElement.addEventListener("click", () => {
                                this.soundIsOn = !this.soundIsOn;
                                this.addAnimation(this.soundIsOn, "Key sound");
                                keyElement.classList.toggle(
                                    "keyboard__key--dark"
                                );
                            });

                            break;

                        case "ArrowRight":
                            keyElement.addEventListener("click", () => {
                                let caretPos = this.elements.inputField
                                    .selectionStart;
                                this.elements.inputField.focus();
                                this.elements.inputField.setSelectionRange(
                                    caretPos + 1,
                                    caretPos + 1
                                );
                            });

                            break;

                        case "ArrowUp":
                        case "ArrowDown":
                        case "AltLeft":
                        case "AltRight":
                            keyElement.addEventListener("click", () => {
                                this.setFocus();
                            });
                            break;

                        case "ControlRight":
                        case "ControlLeft":
                            // keyElement.classList.add("keyboard__key--middle");
                            keyElement.addEventListener("click", () => {
                                this.setFocus();
                            });
                            break;

                        case "CapsLock":
                            keyElement.classList.add(
                                "keyboard__key--wide",
                                "keyboard__key--activatable"
                            );

                            keyElement.addEventListener("click", () => {
                                this._toggleCapsLock();
                            });

                            break;

                        case "Enter":
                            keyElement.classList.add("keyboard__key--middle");

                            keyElement.addEventListener("click", (e) => {
                                this.characterInput("\n");
                            });

                            break;

                        case "Tab":
                            keyElement.classList.add("keyboard__key--middle");

                            keyElement.addEventListener("click", (e) => {
                                this.characterInput("\t");
                            });

                            break;

                        case "Space":
                            keyElement.classList.add(
                                "keyboard__key--extra-wide"
                            );

                            keyElement.addEventListener("click", () => {
                                this.characterInput(" ");
                            });

                            break;

                        case "Done":
                            keyElement.classList.add(
                                "keyboard__key--wide"
                                // "keyboard__key--dark"
                            );

                            keyElement.addEventListener("click", () => {
                                this.close();
                                this._triggerEvent("onclose");
                            });

                            break;

                        case "Speech":
                            keyElement.innerHTML = createIconHTML("mic");
                            keyElement.addEventListener("click", (e) => {
                                this._speechInput(e);
                            });
                            break;

                        case "ShiftLeft":
                        case "ShiftRight":
                            keyElement.classList.add(
                                "keyboard__key--middle",
                                "keyboard__key--activatable"
                            );
                            keyElement.addEventListener("click", (e) => {
                                this._toggleShift(e);
                            });
                            break;

                        case "Lang":
                            keyElement.addEventListener("click", (e) => {
                                this._toggleLang(e);
                            });
                            break;

                        default:
                            keyElement.addEventListener("click", (e) => {
                                let keyCase = keyElement.textContent;
                                this.characterInput(keyCase);
                            });

                            break;
                    }

                    div.appendChild(keyElement);
                }
            });

            fragment.appendChild(div);
        });

        return fragment;
    },

    changeInnerHTML(keyElement, keyObj) {
        //check for icons
        if (keyElement.childElementCount !== 0) {
            return keyElement;
        }
        if (this.properties.shift && !this.properties.capsLock) {
            keyElement.innerHTML = keyObj.shift ? keyObj.shift : keyObj.small;
        } else if (!this.properties.shift && this.properties.capsLock) {
            if (keyObj.small.match(/^[a-z??-????]{1}$/i)) {
                keyElement.innerHTML = keyObj.small.toUpperCase();
            } else {
                keyElement.innerHTML = keyObj.small;
            }
        } else if (this.properties.shift && this.properties.capsLock) {
            if (keyObj.small.match(/^[a-z??-????]{1}$/i)) {
                keyElement.innerHTML = keyObj.small.toLowerCase();
            } else {
                keyElement.innerHTML = keyObj.shift
                    ? keyObj.shift
                    : keyObj.small;
            }
        } else {
            keyElement.innerHTML = keyObj.small;
        }

        return keyElement;
    },

    characterInput(symbol, length = 1) {
        let selectionText = document.getSelection().toString();
        let caretPos = this.elements.inputField.selectionStart;
        let str = this.properties.value;

        if (selectionText) {
            const start = caretPos;
            const end = this.elements.inputField.selectionEnd;
            this.properties.value =
                str.substring(0, start) + symbol + str.substring(end);
        } else {
            this.properties.value =
                str.substring(0, caretPos) + symbol + str.substring(caretPos);
        }
        this._triggerEvent("oninput");
        this.elements.inputField.focus();

        // Start: This parameter holds the index of the first selected character. The index value greater than the length of the element pointing to the end value.
        // End: This parameter holds the index of the character after the last selected character. The index value greater than the length of the element pointing to the end value.
        this.elements.inputField.setSelectionRange(
            caretPos + length,
            caretPos + length
        );
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    isUpper() {
        return this.properties.capsLock ^ this.properties.shift;
    },

    _toggleCapsLock(e) {
        this.properties.capsLock = !this.properties.capsLock;

        document
            .querySelector(`[data-code= CapsLock]`)
            .classList.toggle(
                "keyboard__key--active",
                this.properties.capsLock
            );

        for (const key of this.elements.keys) {
            if (
                key.textContent.match(/^[a-z??-????]{1}$/i) &&
                key.childElementCount === 0
            ) {
                key.textContent = this.isUpper()
                    ? key.textContent.toUpperCase()
                    : key.textContent.toLowerCase();
            }
        }
    },

    _toggleLang(e) {
        this.properties.lang = this.properties.lang === "en" ? "ru" : "en";
        this.keyLayout = language[this.properties.lang];
        this.recognition.lang = speechLang[this.properties.lang];
        //toggle
        if (this.speechIsOn) {
            this._speechInput(e);
        }
        this.elements.keys.forEach((key) => {
            let code = key.getAttribute("data-code");
            let keyObj = this.keyLayout.find((keyL) => keyL.code === code);
            if (keyObj) {
                this.changeInnerHTML(key, keyObj);
            }
        });
    },

    _speechInput(e) {
        this.setFocus();
        this.speechIsOn = !this.speechIsOn;
        this.addAnimation(this.speechIsOn, "Voice input");
        this.elements.keysContainer
            .querySelector(`[data-code*="Speech"]`)
            .classList.toggle("keyboard__key--dark");
        if (this.speechIsOn) {
            this.recognition.start();
        } else {
            this.recognition.stop();
        }
    },

    _toggleShift(e) {
        this.properties.shift = !this.properties.shift;

        this.elements.keys.forEach((key) => {
            let code = key.getAttribute("data-code");
            let keyObj = this.keyLayout.find((keyL) => keyL.code === code);
            if (keyObj) {
                this.changeInnerHTML(key, keyObj);
            }
        });

        this.elements.keysContainer
            .querySelectorAll(`[data-code*="Shift"]`)
            .forEach((el) => {
                el.classList.toggle(
                    "keyboard__key--active",
                    this.properties.shift
                );
            });

        // add active class to capslock after creation new keyboard

        this.elements.keysContainer
            .querySelector(`[data-code*="CapsLock"]`)
            .classList.toggle(
                "keyboard__key--active",
                this.properties.capsLock
            );
    },
    setFocus() {
        let caretPos = this.elements.inputField.selectionStart;
        this.elements.inputField.focus();
        this.elements.inputField.setSelectionRange(caretPos, caretPos);
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.elements.main.classList.add("keyboard--hidden");
    },
};

window.addEventListener("DOMContentLoaded", function (event) {
    Keyboard.init("en");
});
