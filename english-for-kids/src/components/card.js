import { audio } from "../utils/audio";

export default class Card {
    constructor(templateNumber) {
        this.template = document.getElementsByTagName("template")[
            templateNumber
        ];
        // this.categoryNumber = null;
        this.dataWord = null;
        this.audioFile = null;
        this.cardDiv = null;
    }

    createCard(object) {
        let cardTemplate = this.template.content.cloneNode(true);
        this.cardDiv = cardTemplate.querySelector(".card");
        this.audioFile = cardTemplate.querySelector("audio");
        this.image = cardTemplate.querySelector(".card__front-side img");
        this.rotateIcon = cardTemplate.querySelector(".rotate-icon");
        this.dataWord = object.word;

        this.image.setAttribute("src", `../assets/${object.image}`);

        cardTemplate
            .querySelector(".card__back-side img")
            .setAttribute("src", `../assets/${object.image}`);

        this.audioFile.setAttribute("src", `../assets/${object.audioSrc}`);

        cardTemplate.querySelector(".card__title--eng").textContent =
            object.word;
        cardTemplate.querySelector(".card__title--rus").textContent =
            object.translation;

        this.rotateIcon.addEventListener("click", (e) => {
            e.target.closest(".card__inner").classList.add("flipped");
        });

        this.cardDiv.addEventListener("mouseleave", (e) => {
            if (document.querySelector(".flipped")) {
                document.querySelector(".flipped").classList.remove("flipped");
            }
        });
        this.trainHandlerListener = (e) => this.trainHandler(e);
        this.gameHandlerListener = (e) => this.gameHandler(e);
        this.addEvent();

        return cardTemplate;
    }
    trainHandler(e) {
        let rotateIcon = e.target
            .closest(".card")
            .querySelector(".rotate-icon");
        let backSide = e.target.closest(".card__back-side");

        if (e.target === rotateIcon || backSide) {
            return;
        }
        this.playAudioEl();
    }

    gameHandler(e) {
        let dataWord = this.dataWord;
        let cardClick = new CustomEvent("cardClick", {
            detail: {
                dataWord,
            },
            bubbles: true,
        });
        e.target.dispatchEvent(cardClick);
    }

    playAudioEl() {
        const isAudioPlaying =
            !this.audioFile.ended && 0 < this.audioFile.currentTime;
        if (isAudioPlaying) {
            return;
        }
        this.audioFile.currentTime = 0;
        this.audioFile.play();
    }

    addFade() {
        this.cardDiv.classList.add("fade");
    }

    removeFade() {
        this.cardDiv.classList.remove("fade");
    }

    removeEvent() {
        this.cardDiv.removeEventListener("click", this.trainHandlerListener);
        this.cardDiv.addEventListener("click", this.gameHandlerListener);
    }

    removeGameEvent() {
        this.cardDiv.removeEventListener("click", this.gameHandlerListener);
    }

    addEvent() {
        this.cardDiv.addEventListener("click", this.trainHandlerListener);
        this.removeGameEvent();
    }

}
