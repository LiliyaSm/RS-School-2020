import createElement from './createElement';
import * as constants from './constants';
import LocalStorage from './storage';

export default class GameHTML {
  constructor(body, callbacks) {
    this.body = body;
    this.time = null;
    this.overlay = createElement('div', ['overlay', 'hide'], this.body);
    this.callbacks = callbacks;
    this.menuContainer = null;
  }

  init() {
    this.body.setAttribute('class', 'container-fluid');
    this.createHeader();
    this.createField();
    this.createFooter();
    this.createMenu();
  }

  createHeader() {
    const header = createElement('header', null, this.body);

    const menuBtn = createElement('button', ['open-menu'], header.element, [
      ['click', this.callbacks.showMenu],
    ]);

    this.counterContainer = createElement('div', null, header.element);
    const headerMoves = createElement(
      'h1',
      ['header-moves'],
      this.counterContainer.element,
    );

    const timeContainer = createElement('div', null, header.element);
    const headerTime = createElement(
      'h1',
      ['header-time'],
      timeContainer.element,
    );
    this.time = createElement(
      'time',
      ['time'],
      timeContainer.element,
    ).element;

    this.counter = createElement(
      'span',
      ['counter'],
      this.counterContainer.element,
    );

    this.counter.element.textContent = 0;

    menuBtn.element.textContent = 'menu';
    headerMoves.element.textContent = 'moves';
    headerTime.element.textContent = 'time';
  }

  createMenu() {
    this.menuContainer = createElement(
      'div',
      ['menu-container'],
      this.overlay.element,
    );

    this.bestScoresContainer = createElement(
      'div',
      ['best-scores-container', 'hide'],
      this.overlay.element,
    );

    this.notificationText = createElement(
      'span',
      ['notificationText'],
      this.menuContainer.element,
    );

    this.table = createElement(
      'table',
      null,
      this.bestScoresContainer.element,
    );

    this.back = createElement(
      'button',
      ['back'],
      this.bestScoresContainer.element,
      [['click', (e) => this.goBackToMenu(e)]],
    );

    const beginAgain = createElement(
      'button',
      null,
      this.menuContainer.element,
      [['click', this.callbacks.beginAgain]],
    );
    const saveGame = createElement(
      'button',
      null,
      this.menuContainer.element,
      [['click', this.callbacks.saveGameHandler]],
    );
    const loadGame = createElement(
      'button',
      null,
      this.menuContainer.element,
      [['click', this.callbacks.loadGameHandler]],
    );
    this.sound = createElement('button', null, this.menuContainer.element, [
      ['click', (e) => this.toggleSound(e)],
    ]);

    const bestScore = createElement(
      'button',
      null,
      this.menuContainer.element,
      [['click', (e) => this.showBestScores(e)]],
    );
    const btnResume = createElement(
      'button',
      null,
      this.menuContainer.element,
      [['click', this.callbacks.resumeGame]],
    );

    const tr = createElement('tr', null, this.table.element).element;
    constants.TABLE_HEADERS.forEach((name) => {
      const th = createElement('th', null, tr).element;
      th.textContent = name;
    });

    beginAgain.element.textContent = 'New Game';
    saveGame.element.textContent = 'Save Game';
    loadGame.element.textContent = 'Load Game';
    this.sound.element.textContent = 'Sound: On';
    bestScore.element.textContent = '10 best scores';
    btnResume.element.textContent = 'Resume game';
    this.back.element.textContent = 'Back';
  }

  toggleSound(e) {
    this.callbacks.toggleSound(e);
    this.sound.element.textContent = this.sound.element.textContent === 'Sound: Off'
      ? 'Sound: On'
      : 'Sound: Off';
  }

  createField() {
    this.winContainer = createElement('div', ['win-container'], this.body);
    this.canvasRow = createElement('div', ['row'], this.body);
  }

  createFooter() {
    const footer = createElement('footer', null, this.body);
    const quickStartBtn = createElement(
      'button',
      ['quick-start'],
      footer.element,
      [['click', this.callbacks.quickStart]],
    );
    this.select = createElement('select', ['select'], footer.element, [
      ['change', this.callbacks.logValue],
    ]).element;
    const solution = createElement('button', ['solution'], footer.element, [
      ['click', this.callbacks.showSolution],
    ]);

    const options = createElement(
      'option',
      null,
      this.select,
      null,
      ['selected', ''],
      ['selected', 'selected'],
      ['disabled', 'disabled'],
      ['hidden', 'hidden'],
    );

    quickStartBtn.element.textContent = 'New Game';
    solution.element.textContent = 'Solve';
    options.element.textContent = 'Change field size ';

    Object.values(constants.PUZZLE_DIFFICULTY_LIST).forEach((size) => {
      const option = createElement('option', null, this.select, null, [
        'value',
        size,
      ]);
      option.element.textContent = `${size}x${size}`;
    });
  }

  appendCanvas(canvas) {
    this.canvasRow.element.append(canvas);
  }

  goBackToMenu(e) {
    GameHTML.showElement(this.menuContainer.element);
    GameHTML.hideElement(e.target.parentNode);
    if (e.target.parentNode.querySelector('.temporary')) {
      e.target.parentNode.removeChild(
        e.target.parentNode.querySelector('.temporary'),
      );
    }
  }

  showBestScores() {
    const curDifficulty = this.callbacks.getDifficulty();

    this.clearMenuNotification();
    GameHTML.hideElement(this.menuContainer.element);
    GameHTML.showElement(this.bestScoresContainer.element);

    while (this.table.element.rows.length > 1) {
      this.table.element.deleteRow(1);
    }

    const bestScores = LocalStorage.get(`topScoresFor${curDifficulty}`);
    if (!bestScores) {
      const div = createElement(
        'div',
        ['temporary'],
        this.bestScoresContainer.element,
      );
      this.bestScoresContainer.element.insertBefore(
        div.element,
        this.back.element,
      );
      div.element.textContent = 'No records';
    } else {
      const div = createElement(
        'div',
        ['temporary'],
        this.bestScoresContainer.element,
      );

      this.bestScoresContainer.element.insertBefore(
        div.element,
        this.table.element,
      );
      div.element.textContent = `puzzle size: ${curDifficulty} x ${curDifficulty}`;

      bestScores.forEach((el) => {
        const tr = createElement('tr', null, this.table.element);
        constants.TABLE_HEADERS.forEach((name) => {
          const td = createElement('td', null, tr.element);
          td.element.textContent += `${el[name]} `;
        });
      });
    }
  }

  redrawCounter(moveCounter) {
    this.counter.element.textContent = moveCounter;
  }

  clearMenuNotification() {
    if (this.notificationText.element.classList.contains('zoom')) {
      this.notificationText.element.classList.remove('zoom');
    }
    this.notificationText.element.textContent = '';
  }

  addAnimation(text) {
    this.clearMenuNotification();
    // force browser to play animation again, set to null styles
    // eslint-disable-next-line no-void
    void this.notificationText.element.offsetWidth;
    this.notificationText.element.textContent = text;
    this.notificationText.element.classList.add('zoom');
  }

  static hideElement(element) {
    element.classList.add('hide');
  }

  static showElement(element) {
    element.classList.remove('hide');
  }

  hideOverlay(isHide) {
    if (isHide) {
      GameHTML.hideElement(this.overlay.element);
    } else {
      GameHTML.showElement(this.overlay.element);
    }
  }

  removeWinNotification() {
    this.winContainer.element.textContent = '';
  }

  showWinNotification(moveCounter, time) {
    this.winContainer.element.textContent = `Ура! Вы решили головоломку за ${time} и ${moveCounter} ходов`;
  }

  disableSelect(isDisabled) {
    if (isDisabled) {
      this.select.disabled = true;
    } else {
      this.select.disabled = false;
    }
  }
}
