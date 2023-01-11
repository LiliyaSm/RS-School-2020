import { cardsData } from '../../utils/cardsData';
import MenuItem from './menuItem';
import * as constants from '../../data/constants';

export default class Menu {
  constructor() {
    this.navMenu = null;
    this.menuIcon = null;
    this.overlay = null;
    this.itemsObjects = [];
  }

  init() {
    this.menuIcon = document.querySelector('.navigation__icon');
    this.overlay = document.querySelector('.overlay');
    this.input = document.querySelector('input');
    this.navMenu = document.querySelector('.navigation__menu');

    const listOfCategories = cardsData.getCategoriesList();

    const mainMenuItem = this.createItem(
      constants.MAIN_PAGE.mainPageName,
      constants.MAIN_PAGE.textContent,
    );
    mainMenuItem.becomeActive();

    listOfCategories.forEach((category) => {
      this.createItem('cardPage', category);
    });

    this.createItem(
      constants.STATISTICS_PAGE.name,
      constants.STATISTICS_PAGE.textContent,
    );

    this.menuIcon.addEventListener('click', () => {
      this.toggleMenu();
    });

    this.overlay.addEventListener('click', () => {
      this.closeMenu();
    });

    document.body.addEventListener(
      constants.CUSTOM_EVENT_NAME.navigate,
      (event) => {
        const { pageName } = event.detail;
        const { categoryName } = event.detail;
        const curItem = this.itemsObjects.find(
          (item) => item.pageName === pageName
                    && item.categoryName === categoryName,
        );
        if (curItem) {
          curItem.becomeActive();
        }
      },
    );
  }

  createItem(pageName, textContent) {
    const item = new MenuItem(pageName, textContent);
    this.navMenu.appendChild(item.createMenuItem());
    item.navLink.addEventListener('click', () => {
      this.closeMenu();
    });
    this.itemsObjects.push(item);
    return item;
  }

  toggleMenu() {
    this.navMenu.classList.toggle('slide_menu');
    this.navMenu.classList.toggle('hide_menu');
    this.overlay.classList.toggle('hide');
    this.input.classList.toggle('checked');
    document.body.classList.toggle('no-scroll');
  }

  closeMenu() {
    if (this.navMenu.classList.contains('slide_menu')) {
      this.navMenu.classList.remove('slide_menu');
      this.navMenu.classList.add('hide_menu');
      this.input.classList.remove('checked');
      document.body.classList.remove('no-scroll');
      this.overlay.classList.add('hide');
    }
  }
}
