import cards from "../data/cards";
import { audio } from "../utils/audio";

const Card = {
    cardTemplate: null,
    categoryNumber: null,
    cards: document.querySelector(".cards"),

    init(categoryNumber) {
        this.cards.textContent = "";

        this.cardTemplate = document.getElementsByTagName("template")[0];
        let wordCards = cards.slice(1);

        console.log(wordCards);

        wordCards[categoryNumber].forEach((card) => {
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

                if (e.target === rotateIcon) {
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

            this.cards.appendChild(clon);
        });
    },
};

export { Card };
