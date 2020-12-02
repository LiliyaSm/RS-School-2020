import { cardsData } from '../utils/cardsData';
import * as constants from '../data/constants';

export default class MainCard {
  constructor(templateNumber) {
    this.template = document.getElementsByTagName('template')[
      templateNumber
    ];
    this.categoryNumber = null;
    this.pageID = null;
    this.cardDiv = null;
    this.categoryName = null;
    this.title = null;
  }

  createCard(categoryName, pageID) {
    this.pageID = pageID;
    this.categoryName = categoryName;
    const cardTemplate = this.template.content.cloneNode(true);

    this.title = cardTemplate.querySelector('.card__main-title');

    const name = cardsData.getCategoryImage(pageID);
    cardTemplate
      .querySelector('.card__image img')
      .setAttribute('src', `../assets/${name}`);

    this.title.textContent = categoryName;
    this.cardDiv = cardTemplate.querySelector('.card');
    this.cardDiv.addEventListener('click', (e) => {
      this.openCardPage(e);
    });
    return cardTemplate;
  }

  openCardPage(e) {
    const pageName = constants.CARD_PAGE_NAME;
    const { categoryName } = this;

    const navigate = new CustomEvent('navigate', {
      detail: {
        pageName,
        categoryName,
        params: [],
      },
      bubbles: true,
    });
    e.target.dispatchEvent(navigate);
  }
}
