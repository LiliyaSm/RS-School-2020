import cards from "../data/cards";

const Card = {
    cardTemplate: null,
    categoryNumber: null,
    cards: document.querySelector(".cards"),

    init(categoryNumber) {
        this.cardTemplate = document.getElementsByTagName("template")[0];
        // cardTemplate.querySelector(":first-child").classList.add("");
        let wordCards = cards.slice(1);

        console.log(wordCards);

        wordCards[categoryNumber].forEach((card) => {
            let clon = this.cardTemplate.content.cloneNode(true);
            clon.querySelector(".card__front-side img").setAttribute(
                "src",
                `../assets/${card.image}`
            );

            clon.querySelector(".card__back-side img").setAttribute(
                "src",
                `../assets/${card.image}`
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
                "mouseleave",
                function (e) {
                    console.log(e.target);

                    if (document.querySelector(".flipped")) {
                        console.log("out");
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
