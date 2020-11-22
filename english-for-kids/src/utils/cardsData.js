import cards from "../data/cards";


const cardsData = {
    wordCards: null,
    categories: null,

    loadData() {
        this.wordCards = cards.slice(1);
        this.categories = cards.slice(0, 1);
    },

    getCategoryCards(categoryNumber) {
        return this.wordCards[categoryNumber];
    },

    getCategotiesList() {
        return this.categories;
    },
};


export { cardsData };
