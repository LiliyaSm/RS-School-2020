import cards from '../data/cards';

export const cardsData = {
  wordCards: null,
  categories: null,

  loadData() {
    this.wordCards = cards;
    this.categories = Object.keys(
      cards.reduce(
        (acc, { category }) => ({
          ...acc,
          [category]: true,
        }),
        {},
      ),
    );
  },

  getCategoryCards(categoryName) {
    return this.wordCards.filter(
      ({ category }) => category === categoryName,
    );
  },

  getCategoriesList() {
    return this.categories;
  },

  getCategoryImage(categoryName) {
    return this.wordCards.find(({ category }) => category === categoryName)?.image;
  },

  getCardObject(category, word) {
    return cardsData
      .getCategoryCards(category)
      .find((obj) => obj.word === word);
  },
};

export { cardsData as default };
