import cards from "../data/cards";


const cardsData = {
    wordCards: null,
    categories: null,

    loadData() {
        this.wordCards = cards.slice(1);
        this.categories = cards[0];
    },

    getCategoryCards(categoryName) {
        return this.wordCards[this.categories.indexOf(categoryName)];
    },

    getCategoriesList() {
        return this.categories;
    },

    getCategoryImage(i){
        return this.wordCards[i][0].image;
    }
};


export { cardsData };
