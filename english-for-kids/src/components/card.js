import { cardsData } from "../utils/cardsData";
import { audio } from "../utils/audio";

class Card {
    constructor() {
        this.cardTemplate = null;
        this.categoryNumber = null;
        this.cardsContainer = document.querySelector(".cards");
    }
    // init() {
    // },

    renderCards(categoryNumber, trainMode) {
        let wordCards = cardsData.getCategoryCards(categoryNumber);

        this.cardsContainer.textContent = "";

        this.cardTemplate = document.getElementsByTagName("template")[0];

        console.log(wordCards);

        wordCards.forEach((card) => {
            let clon = this.cardTemplate.content.cloneNode(true);

            clon.querySelector(".card").setAttribute(
                "data-word",
                `${card.word}`
            );

            clon.querySelector(".card__front-side img").setAttribute(
                "src",
                `../assets/${card.image}`
            );

            clon.querySelector(".card__back-side img").setAttribute(
                "src",
                `../assets/${card.image}`
            );

            clon.querySelector("audio").setAttribute(
                "src",
                `../assets/${card.audioSrc}`
            );

            clon.querySelector(".card__title--eng").textContent = card.word;
            clon.querySelector(".card__title--rus").textContent =
                card.translation;

            clon.querySelector(".rotate-icon").addEventListener(
                "click",
                function (e) {
                    this.closest(".card__inner").classList.add("flipped");
                }
            );

            clon.querySelector(".card").addEventListener("click", function (e) {
                let rotateIcon = this.closest(".card").querySelector(
                    ".rotate-icon"
                );

                let backSide = e.target.closest(".card__back-side");

                if (e.target === rotateIcon || backSide) {
                    return;
                }

                let clickedCard = this.closest(".card").getAttribute(
                    "data-word"
                );
                audio.playSound(clickedCard);
            });

            clon.querySelector(".card").addEventListener(
                "mouseleave",
                function (e) {
                    if (document.querySelector(".flipped")) {
                        console.log(e.target.querySelector(".card__inner"));
                        document
                            .querySelector(".flipped")
                            .classList.remove("flipped");
                    }
                }
            );

            this.cardsContainer.appendChild(clon);
        });

        if (trainMode) {
            this.toggleStyle(trainMode);
        }
    }

    toggleStyle(gameMode) {
        let cards = document.querySelectorAll(".card");

        cards.forEach((card) => {
            let image = card.querySelector(".card__image img");
            let icon = card.querySelector(".rotate-icon");
            if (gameMode) {
                image.classList.add("game-mode");
                icon.classList.add("hide");
            } else {
                if (image.classList.contains("game-mode")) {
                    image.classList.remove("game-mode");
                }
                if (icon.classList.contains("hide")) {
                    icon.classList.remove("hide");
                }
            }
        });
    }
}

export { Card };
