import { audio } from "../utils/audio";

export default class Card {
    constructor(templateNumber) {
        this.cardTemplate = document.getElementsByTagName("template")[
            templateNumber
        ];
        this.categoryNumber = null;
        this.dataWord = null;
        this.audioFile = null;
        this.cardDiv = null;
    }

    createCard(object) {
        let clon = this.cardTemplate.content.cloneNode(true);
        this.cardDiv = clon.querySelector(".card");
        this.audioFile = clon.querySelector("audio");
        this.image = clon.querySelector(".card__front-side img");
        this.rotateIcon = clon.querySelector(".rotate-icon");
        this.dataWord = object.word;

        this.image.setAttribute("src", `../assets/${object.image}`);

        clon.querySelector(".card__back-side img").setAttribute(
            "src",
            `../assets/${object.image}`
        );

        this.audioFile.setAttribute("src", `../assets/${object.audioSrc}`);

        clon.querySelector(".card__title--eng").textContent = object.word;
        clon.querySelector(".card__title--rus").textContent =
            object.translation;

        this.rotateIcon.addEventListener("click", (e) => {
            e.target.closest(".card__inner").classList.add("flipped");
        });

        this.cardDiv.addEventListener("mouseleave", (e) => {
            if (document.querySelector(".flipped")) {
                document.querySelector(".flipped").classList.remove("flipped");
            }
        });
        this.clickEventListener = (e) => this.trainHandler(e);
        this.addEvent();

        return clon;
    }
    trainHandler(e) {
        let rotateIcon = e.target
            .closest(".card")
            .querySelector(".rotate-icon");
        let backSide = e.target.closest(".card__back-side");

        if (e.target === rotateIcon || backSide) {
            return;
        }
        audio.playAudioEl(this.audioFile);
    }

    removeEvent() {
        this.cardDiv.removeEventListener("click", this.clickEventListener);
    }

    addEvent(){
        this.cardDiv.addEventListener("click", this.clickEventListener);

    };
}
