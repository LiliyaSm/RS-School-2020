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

    properties: {
        value: "",
        capsLock: false,
    },

    init() {
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
        const keyLayout = {
            1: {
                text: "1",
                event: "Digit1",
            },
            2: {
                text: "2",
                event: "Digit2",
            },
            3: {
                text: "3",
                event: "Digit3",
            },
            4: {
                text: "4",
                event: "Digit4",
            },
            5: {
                text: "5",
                event: "Digit5",
            },
            6: {
                text: "6",
                event: "Digit6",
            },
            7: {
                text: "7",
                event: "Digit6",
            },
            8: {
                text: "8",
                event: "Digit6",
            },
            9: {
                text: "9",
                event: "Digit9",
            },
            0: {
                text: "0",
                event: "Digit0",
            },
            "-": {
                text: "-",
                event: "Minus",
            },

            "=": {
                text: "=",
                event: "Equal",
            },

            backspace: {
                text: "Backspace",
                event: "Backspace",
            },
            q: {
                text: "q",
                event: "KeyQ",
            },
            w: {
                text: "w",
                event: "KeyW",
            },
            e: {
                text: "e",
                event: "KeyE",
            },
            r: {
                text: "r",
                event: "KeyR",
            },
            t: {
                text: "t",
                event: "KeyT",
            },
            y: {
                text: "y",
                event: "KeyY",
            },
            u: {
                text: "u",
                event: "KeyU",
            },
            i: {
                text: "i",
                event: "KeyI",
            },
            o: {
                text: "o",
                event: "KeyO",
            },
            p: {
                text: "p",
                event: "KeyP",
            },
            caps: {
                text: "Caps lock",
                event: "CapsLock",
            },
            a: {
                text: "a",
                event: "KeyA",
            },
            s: {
                text: "s",
                event: "KeyS",
            },
            d: {
                text: "d",
                event: "KeyD",
            },
            f: {
                text: "f",
                event: "KeyF",
            },
            g: {
                text: "g",
                event: "KeyG",
            },
            h: {
                text: "h",
                event: "KeyH",
            },
            j: {
                text: "j",
                event: "KeyJ",
            },
            k: {
                text: "k",
                event: "KeyK",
            },
            l: {
                text: "l",
                event: "KeyL",
            },
            enter: {
                text: "Enter",
                event: "Enter",
            },
            done: {
                text: "Close Keyboard",
                event: "",
            },
            shift: {
                text: "Shift",
                event: "ShiftLeft",
            },
            z: {
                text: "z",
                event: "KeyZ",
            },
            x: {
                text: "x",
                event: "KeyX",
            },
            c: {
                text: "c",
                event: "KeyC",
            },
            v: {
                text: "v",
                event: "KeyV",
            },
            b: {
                text: "b",
                event: "KeyB",
            },
            n: {
                text: "n",
                event: "KeyN",
            },
            m: {
                text: "m",
                event: "KeyM",
            },

            ",": {
                text: ",",
                event: "Comma",
            },

            ".": {
                text: ".",
                event: "Period",
            },
            "/": {
                text: "/",
                event: "Slash",
            },

            shift: {
                text: "Shift",
                event: "ShiftRight",
            },

            up: {
                text: "&#8593;",
                event: "ArrowUp",
            },
            space: {
                text: "",
                event: "Space",
            },
        };

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        Object.entries(keyLayout).forEach(([key,value]) => {
            const keyElement = document.createElement("button");
            const insertLineBreak =
                ["backspace", "p", "enter", "up"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = value.text;
                    keyElement.setAttribute("data-code", "Backspace");

                    keyElement.addEventListener("click", () => {
                        let caretPos = this.elements.inputField.selectionStart;
                        let str = this.properties.value;

                        this.properties.value =
                            str.substring(0, caretPos-1) +                            
                            str.substring(caretPos);
                        this._triggerEvent("oninput");

                        this.elements.inputField.focus();

                        // Start: This parameter holds the index of the first selected character. The index value greater than the length of the element pointing to the end value.
                        // End: This parameter holds the index of the character after the last selected character. The index value greater than the length of the element pointing to the end value.
                        this.elements.inputField.setSelectionRange(
                            caretPos-1,
                            caretPos-1
                        );
                    });

                    break;

                case "caps":
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

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = "Enter";
                    keyElement.setAttribute("data-code", "Enter");

                    keyElement.addEventListener("click", (e) => {
                        this.characterInput("\n");
                    });

                    break;

                case "up":
                    keyElement.classList.add("keyboard__key--wide");
                    // keyElement.innerHTML = createIconHTML("keyboard_return");
                    keyElement.innerHTML = "&#8593;";

                    keyElement.addEventListener("click", () => {
                        this._triggerEvent("oninput");
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.setAttribute("data-code", "Space");

                    keyElement.addEventListener("click", () => {
                        this.characterInput(" ");
                    });

                    break;

                case "done":
                    keyElement.classList.add(
                        "keyboard__key--wide",
                        "keyboard__key--dark"
                    );
                    keyElement.innerHTML = createIconHTML("check_circle");

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

                case ",":
                    keyElement.setAttribute("data-code", "Comma");
                    keyElement.textContent = key;
                    keyElement.addEventListener("click", () => {
                        this.characterInput(key);
                    });
                    break;

                case "-":
                    keyElement.setAttribute("data-code", "Minus");
                    keyElement.textContent = key;
                    keyElement.addEventListener("click", () => {
                        this.characterInput(key);
                    });
                    break;

                default:
                    // keyElement.textContent = key.toLowerCase();
                    // event.code;
                    keyElement.innerHTML = key;

                    // if (isNaN(key)) {
                    // let dataAttr = `Key${key.toUpperCase()}`;
                    keyElement.setAttribute("data-code", value.event);

                    key = this.properties.capsLock
                        ? key.toUpperCase()
                        : key.toLowerCase();

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

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
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
    Keyboard.init();
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
