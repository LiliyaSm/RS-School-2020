import cards from "../data/cards";


const Card = {
    cardTemplate: null,
    cards : document.querySelector(".cards"),

    init() {
        this.cardTemplate = document.getElementsByTagName("template")[0];
        // cardTemplate.querySelector(":first-child").classList.add("");
        let wordCards = cards.slice(1);

        console.log(wordCards);

        wordCards[0].forEach((card) => {
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
                this.cards.appendChild(clon);
        });
    },
};

export { Card };
