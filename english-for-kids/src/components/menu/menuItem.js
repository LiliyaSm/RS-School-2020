import createElement from '../../utils/createElement';
import * as constants from '../../data/constants';

export default class MenuItem {
  constructor(pageName, categoryName) {
    this.pageName = pageName;
    this.navMenu = document.querySelector('.navigation__menu');
    this.categoryName = categoryName;
    this.navLink = null;
  }

  createMenuItem() {
    const { element: li } = createElement(
      'li',
      ['navigation__menu__item'],
      this.navMenu,
    );
    const { element: navLink } = createElement('a', null, li, [
      ['href', '#'],
    ]);
    this.navLink = navLink;
    this.navLink.textContent = this.categoryName;

    this.navLink.addEventListener('click', (e) => {
      this.clickHandler(e);
    });
    return li;
  }

  clickHandler(e) {
    const { categoryName } = this;
    const { pageName } = this;
    const navigate = new CustomEvent(constants.CUSTOM_EVENT_NAME.navigate, {
      detail: {
        pageName,
        categoryName,
        params: [],
      },
      bubbles: true,
    });
    e.target.dispatchEvent(navigate);
  }

  becomeActive() {
    if (this.navMenu.querySelector('.active')) {
      this.navMenu.querySelector('.active').classList.remove('active');
    }
    this.navLink.classList.add('active');
  }
}
