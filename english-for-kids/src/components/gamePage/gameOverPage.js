import createElement from '../../utils/createElement';
import Page from '../page';
import * as constants from '../../data/constants';
import audio from '../../utils/audio';

export default class GameOverPage extends Page {
  renderPage(gameMode, categoryName, params) {
    const { errorCounter } = params;
    super.hideToggle();
    if (errorCounter > 0) {
      audio.playSound(constants.SOUNDS.loseGame);
      createElement(
        'img',
        ['lose-image'],
        this.mainContainer,
        [['src', constants.loseImage]],
        null,
      );
      const errorNumber = createElement(
        'h1',
        ['error-number'],
        this.mainContainer,
        null,
        null,
      ).element;

      errorNumber.textContent = `Number of errors: ${errorCounter}`;
    } else {
      audio.playSound(constants.SOUNDS.winGame);
      createElement(
        'img',
        ['success-image'],
        this.mainContainer,
        [['src', constants.successImage]],
        null,
      );
    }
    setTimeout(
      () => GameOverPage.openMainPage(),
      constants.TIME.redirectFromGameOver,
    );
  }

  static openMainPage() {
    const pageName = constants.MAIN_PAGE.mainPageName;
    const categoryName = constants.MAIN_PAGE.textContent;

    const navigate = new CustomEvent(
      constants.CUSTOM_EVENT_NAME.navigate,
      {
        detail: {
          pageName,
          categoryName,
          params: [constants.MAIN_PAGE.textContent],
        },
        bubbles: true,
      },
    );
    document.body.dispatchEvent(navigate);
  }
}
