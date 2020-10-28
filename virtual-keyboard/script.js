import language from "./layouts/index.js"; // { en, ru }

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
        "Delete",
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
        "Done",
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
        "Win",
        "AltLeft",
        "Space",
        "AltRight",
        "ControlRight",
        "ArrowLeft",
        "ArrowDown",
        "ArrowRight",
    ],
];

const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
        inputField: null,
        title: null,
    },

    eventHandlers: {
        oninput: null,
        onclose: null,
    },

    keyLayout: null,

    properties: {
        value: "",
        capsLock: false,
        shift: false,
    },

    init(langCode) {
        this.keyLayout = language[langCode];
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");
        this.elements.inputField = document.createElement("textarea");
        this.elements.title = document.createElement("h1");

        //CHECK IF USER ALREADY HAS CAPSLOCK ON
        this.elements.inputField.addEventListener("click", (event) => {
            if (event.getModifierState("CapsLock")) {
                this._toggleCapsLock();
            }
        });

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.inputField.classList.add("use-keyboard-input");
        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.title.textContent = "Virtual keyboard";

        this.elements.keys = this.elements.keysContainer.querySelectorAll(
            ".keyboard__key"
        );

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.title);
        document.body.appendChild(this.elements.inputField);
        document.body.appendChild(this.elements.main);

        document.addEventListener("keydown", (e) => {
            if (e.which == 20 || e.keyCode == 20) {
                this._toggleCapsLock();
            }
        });

        window.addEventListener("keydown", (event) => {
            let pressedBtn = document.querySelector(
                `[data-code= ${event.code}]`
            );
            pressedBtn.classList.add("pressed-button");
            if (event.key.match(/^[a-zа-яё]{1}$/i)) {
                let symbol = this.properties.capsLock
                    ? event.key.toLocaleUpperCase()
                    : event.key.toLocaleLowerCase();
                event.preventDefault();
                this.characterInput(symbol);
            }
        });

        window.addEventListener("keyup", (event) => {
            let pressedBtn = document.querySelector(
                `[data-code= ${event.code}]`
            );
            pressedBtn.classList.remove("pressed-button");

            //synchronization after entering by physical keyboard
            Keyboard.properties.value = document.querySelector(
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

    _createKeys() {
        const fragment = document.createDocumentFragment();

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        rowsOrder.forEach((row, i) => {
            let div = document.createElement("div");
            // const insertLineBreak =
            //     [
            //         "Delete",
            //         "Backspace",
            //         "Enter",
            //         "ShiftRight",
            //         "ControlRight",
            //     ].indexOf(value.small) !== -1;

            row.forEach((code) => {
                const keyElement = document.createElement("button");
                keyElement.setAttribute("type", "button");
                keyElement.classList.add("keyboard__key");

                // keyElement.addEventListener("click", (event) => {
                //     var x = event.getModifierState("CapsLock");})

                const keyObj = this.keyLayout.find((key) => key.code === code);

                if (keyObj) {
                    keyElement.setAttribute("data-code", keyObj.code);

                    if (this.properties.shift) {
                        keyElement.innerHTML = keyObj.shift
                            ? keyObj.shift
                            : keyObj.small;
                    } else {
                        keyElement.innerHTML = keyObj.small;
                    }

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
                                    this.properties.value =
                                        str.substring(0, caretPos - 1) +
                                        str.substring(caretPos);
                                    this._triggerEvent("oninput");
                                    this.elements.inputField.focus();

                                    this.elements.inputField.setSelectionRange(
                                        caretPos - 1,
                                        caretPos - 1
                                    );
                                }
                            });

                            break;

                        case "CapsLock":
                            keyElement.classList.add(
                                "keyboard__key--wide",
                                "keyboard__key--activatable"
                            );

                            keyElement.addEventListener("click", () => {
                                this._toggleCapsLock();
                                // keyElement.classList.toggle(
                                //     "keyboard__key--active",
                                //     this.properties.capsLock
                                // );
                            });

                            break;

                        case "Enter":
                            keyElement.classList.add("keyboard__key--wide");

                            keyElement.addEventListener("click", (e) => {
                                this.characterInput("\n");
                            });

                            break;

                        case "Tab":
                            keyElement.classList.add("keyboard__key--wide");

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
                                "keyboard__key--wide",
                                "keyboard__key--dark"
                            );
                            keyElement.innerHTML = createIconHTML(
                                "check_circle"
                            );

                            keyElement.addEventListener("click", () => {
                                this.close();
                                this._triggerEvent("onclose");
                            });

                            break;

                        case "ShiftLeft":
                        case "ShiftRight":
                            keyElement.classList.add(
                                "keyboard__key--wide",
                                "keyboard__key--activatable"
                            );
                            keyElement.addEventListener("click", (e) => {
                                this._toggleShift(e);
                            });
                            break;

                        case "AltLeft":
                        case "AltRight":
                            keyElement.addEventListener("click", () => {
                                this.elements.inputField.focus();
                            });
                            break;

                        case "ControlRight":
                        case "ControlLeft":
                            keyElement.addEventListener("click", () => {
                                this.elements.inputField.focus();
                            });
                            break;

                        default:
                            let key = keyObj.small;
                            let shiftKey = keyObj.shift;
                            keyElement.addEventListener("click", () => {
                                if (this.properties.shift) {
                                    this.characterInput(shiftKey);
                                } else {
                                    let keyCase = this.properties.capsLock
                                        ? key.toUpperCase()
                                        : key.toLowerCase();
                                    this.characterInput(keyCase);
                                }
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

    characterInput(symbol) {
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
        this.elements.inputField.setSelectionRange(caretPos + 1, caretPos + 1);
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock(e) {
        this.properties.capsLock = !this.properties.capsLock;

        document
            .querySelector(`[data-code= CapsLock]`)
            .classList.toggle(
                "keyboard__key--active",
                this.properties.capsLock
            );

        // const keyObj = this.keyLayout.find((keyL) => keyL.code === key.dataset.code);
        for (const key of this.elements.keys) {
            if (
                key.textContent.match(/^[a-zа-яё]{1}$/i) &&
                key.childElementCount === 0
            ) {
                key.textContent = this.properties.capsLock
                    ? key.textContent.toUpperCase()
                    : key.textContent.toLowerCase();
            }
        }
    },

    _toggleShift(e) {
        this.properties.shift = !this.properties.shift;
        this.elements.main.removeChild(this.elements.keysContainer);

        this.elements.keysContainer = document.createElement("div");
        this.elements.keysContainer.classList.add("keyboard__keys");

        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.main.appendChild(this.elements.keysContainer);
        this.elements.keys = this.elements.keysContainer.querySelectorAll(
            ".keyboard__key"
        );

        this.elements.keysContainer
            .querySelectorAll(`[data-code*="Shift"]`)
            .forEach((el) => {
                el.classList.toggle(
                    "keyboard__key--active",
                    this.properties.shift
                );
            });

        // for (const key of this.elements.keys) {
        //     if (

        //         key.childElementCount === 0
        //     ) {
        //         key.textContent = this.properties.shift
        //             ? key.textContent.shift()
        //             : key.textContent.toLowerCase();
        //     }
        // }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        // this.eventHandlers.oninput = oninput;
        // this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    },
};

window.addEventListener("DOMContentLoaded", function (event) {
    Keyboard.init("en");
});
