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
    },

    init(langCode) {
        this.keyLayout = language[langCode];
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");
        this.elements.inputField = document.createElement("textarea");
        this.elements.title = document.createElement("h1");

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
                const keyObj = this.keyLayout.find((key) => key.code === code);
                // Add attributes/classes
                keyElement.setAttribute("type", "button");
                keyElement.classList.add("keyboard__key");

                if (keyObj) {
                    switch (keyObj.code) {
                        case "Backspace":
                            keyElement.classList.add("keyboard__key--wide");
                            keyElement.innerHTML = keyObj.small;
                            keyElement.setAttribute("data-code", "Backspace");

                            keyElement.addEventListener("click", () => {
                                let caretPos = this.elements.inputField
                                    .selectionStart;
                                let str = this.properties.value;

                                this.properties.value =
                                    str.substring(0, caretPos - 1) +
                                    str.substring(caretPos);
                                this._triggerEvent("oninput");

                                this.elements.inputField.focus();

                                // Start: This parameter holds the index of the first selected character. The index value greater than the length of the element pointing to the end value.
                                // End: This parameter holds the index of the character after the last selected character. The index value greater than the length of the element pointing to the end value.
                                this.elements.inputField.setSelectionRange(
                                    caretPos - 1,
                                    caretPos - 1
                                );
                            });

                            break;

                        case "CapsLock":
                            keyElement.classList.add(
                                "keyboard__key--wide",
                                "keyboard__key--activatable"
                            );
                            // keyElement.innerHTML = createIconHTML("keyboard_capslock");

                            keyElement.addEventListener("click", () => {
                                this._toggleCapsLock();
                                keyElement.classList.toggle(
                                    "keyboard__key--active",
                                    this.properties.capsLock
                                );
                            });

                            break;

                        case "Enter":
                            keyElement.classList.add("keyboard__key--wide");
                            keyElement.innerHTML = keyObj.small;
                            keyElement.setAttribute("data-code", keyObj.small);

                            keyElement.addEventListener("click", (e) => {
                                this.characterInput("\n");
                            });

                            break;

                        case "Tab":
                            keyElement.classList.add("keyboard__key--wide");
                            keyElement.innerHTML = keyObj.small;
                            keyElement.setAttribute("data-code", keyObj.small);

                            keyElement.addEventListener("click", (e) => {
                                this.characterInput("\t");
                            });

                            break;

                        case "Space":
                            keyElement.classList.add(
                                "keyboard__key--extra-wide"
                            );
                            keyElement.innerHTML = keyObj.small;
                            keyElement.setAttribute("data-code", keyObj.small);

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

                        case "shift":
                            keyElement.classList.add("keyboard__key--wide");
                            keyElement.textContent = "Shift";

                            keyElement.addEventListener("click", () => {});

                            break;

                        default:
                            // keyElement.textContent = key.toLowerCase();
                            // event.code;
                            keyElement.innerHTML = keyObj.small;

                            // if (isNaN(key)) {
                            // let dataAttr = `Key${key.toUpperCase()}`;
                            keyElement.setAttribute("data-code", keyObj.code);

                            let key = this.properties.capsLock
                                ? keyObj.small.toUpperCase()
                                : keyObj.small.toLowerCase();

                            keyElement.addEventListener("click", () => {
                                this.characterInput(key);
                            });
                            // } else {
                            // let dataAttr = `Digit${key}`;
                            // keyElement.setAttribute("data-code", dataAttr);

                            // keyElement.addEventListener("click", () => {
                            //     this.characterInput(key);
                            // });
                            // }

                            break;
                    }

                    div.appendChild(keyElement);
                }
            });

            // div.appendChild(document.createElement("br"));
            fragment.appendChild(div);
        });

        return fragment;
    },

    characterInput(symbol) {
        let caretPos = this.elements.inputField.selectionStart;
        let str = this.properties.value;

        this.properties.value =
            str.substring(0, caretPos) + symbol + str.substring(caretPos);
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

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock
                    ? key.textContent.toUpperCase()
                    : key.textContent.toLowerCase();
            }
        }
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

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init("en");
    window.addEventListener("keydown", function (event) {
        let pressedBtn = document.querySelector(`[data-code= ${event.code}]`);
        pressedBtn.classList.add("pressed-button");
    });

    window.addEventListener("keyup", function (event) {
        let pressedBtn = document.querySelector(`[data-code= ${event.code}]`);
        pressedBtn.classList.remove("pressed-button");
        //synchronization after entering by physical keyboard
        Keyboard.properties.value = document.querySelector(
            ".use-keyboard-input"
        ).value;
    });
});
