import Menu from './components/menu/menu';
import MainPage from './components/mainPage/mainPage';
import CardPage from './components/cardPage/cardPage';
import GameOverPage from './components/gamePage/gameOverPage';
import StatisticsPage from './components/statisticsPage';
import LocalStorage from './utils/localStorage';
import * as constants from './data/constants';

class Main {
  constructor(storage) {
    this.isGameMode = false;
    this.currPage = null;
    this.pages = null;
    this.storage = storage;
  }

  init() {
    this.pages = {
      mainPage: new MainPage(),
      cardPage: new CardPage(),
      gameOverPage: new GameOverPage(),
      statisticsPage: new StatisticsPage(this.storage),
    };

    const { statisticsPage } = this.pages;
    statisticsPage.init();

    this.initMainPage();
    Main.initMenu();

    document.querySelector('.toggle').addEventListener('change', () => {
      this.setGameState();
    });

    document.body.addEventListener('navigate', (event) => {
      const params = event.detail.params || [];
      this.pageName = event.detail.pageName;
      this.currPage.leavePage();
      this.currPage = this.pages[this.pageName];
      this.currPage.renderPage(
        this.isGameMode,
        event.detail.categoryName,
        params,
      );
    });
  }

  initMainPage() {
    this.currPage = this.pages.mainPage;
    this.currPage.init();
    this.currPage.renderPage(this.isGameMode);
  }

  static initMenu() {
    const menu = new Menu();
    menu.init();
  }

  setGameState() {
    this.isGameMode = !this.isGameMode;
    this.currPage.toggleStyle(this.isGameMode);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const main = new Main(new LocalStorage(constants.LOCAL_STORAGE_NAME));
  main.init();
});
