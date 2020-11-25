import { cardsData } from "../utils/cardsData";
import { audio } from "../utils/audio";

class Card {
    constructor(templateNumber) {
        this.cardTemplate = document.getElementsByTagName("template")[
            templateNumber
        ];
        this.categoryNumber = null;
        this.cardsContainer = document.querySelector(".cards");
    }

    renderCards(categoryNumber, trainMode) {
        let wordCards = cardsData.getCategoryCards(categoryNumber);

        this.cardsContainer.textContent = "";

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

            clon.querySelector(".card").addEventListener(
                "click",
                this.trainHandler
            );

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

    trainHandler(e) {
        let rotateIcon = e.target.closest(".card").querySelector(".rotate-icon");
        let clickedCard = e.target.closest(".card").getAttribute("data-word");
        let backSide = e.target.closest(".card__back-side");

        if (e.target === rotateIcon || backSide) {
            return;
        }
        audio.playSound(clickedCard);
    }

    toggleStyle(gameMode) {
        let cards = document.querySelectorAll(".card");

        cards.forEach((card) => {
            let image = card.querySelector(".card__image img");
            let icon = card.querySelector(".rotate-icon");
            let startBtn = document.querySelector(".start-btn");
            if (gameMode) {
                image.classList.add("game-mode");
                icon.classList.add("hide");
                startBtn.classList.remove("hide");
                cards.forEach((card) =>
                    card.removeEventListener("click", this.trainHandler)
                );
            } else {
                if (image.classList.contains("game-mode")) {
                    image.classList.remove("game-mode");
                    startBtn.classList.add("hide");
                }
                if (icon.classList.contains("hide")) {
                    icon.classList.remove("hide");
                }
                cards.forEach((card) =>
                    card.addEventListener("click", this.trainHandler)
                );
            }
        });
    }
}

export { Card };
