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
    this.storage = new LocalStorage();
    this.body.setAttribute('class', 'container-fluid');
    this.createHeader();
    this.createField();
    this.createFooter();
    this.createMenu();
  }

  createHeader() {
    const header = createElement('header', null, this.body);

    const menuBtn = createElement('button', ['open-menu'], header);

    this.counterContainer = createElement('div', null, header);
    const headerMoves = createElement(
      'h1',
      ['header-moves'],
      this.counterContainer,
    );

    const timeContainer = createElement('div', null, header);
    const headerTime = createElement('h1', ['header-time'], timeContainer);
    this.time = createElement('time', ['time'], timeContainer);

    this.counter = createElement(
      'span',
      ['counter'],
      this.counterContainer,
    );

    this.counter.textContent = 0;
    menuBtn.addEventListener('click', this.callbacks.showMenu);

    menuBtn.textContent = 'menu';
    headerMoves.textContent = 'moves';
    headerTime.textContent = 'time';
  }

  createMenu() {
    this.menuContainer = createElement(
      'div',
      ['menu-container'],
      this.overlay,
    );
    this.bestScoresContainer = createElement(
      'div',
      ['best-scores-container', 'hide'],
      this.overlay,
    );

    this.notificationText = createElement(
      'span',
      ['notificationText'],
      this.menuContainer,
    );

    this.table = createElement('table', null, this.bestScoresContainer);

    this.back = createElement('button', ['back'], this.bestScoresContainer);

    const beginAgain = createElement('button', null, this.menuContainer);
    const saveGame = createElement('button', null, this.menuContainer);
    const loadGame = createElement('button', null, this.menuContainer);
    this.sound = createElement('button', null, this.menuContainer);

    const bestScoreBtn = createElement('button', null, this.menuContainer);
    const btnResume = createElement('button', null, this.menuContainer);

    btnResume.textContent = 'Resume game';
    this.sound.textContent = 'Sound: On';
    bestScoreBtn.textContent = '10 best scores';
    beginAgain.textContent = 'New Game';
    saveGame.textContent = 'Save Game';
    loadGame.textContent = 'Load Game';
    this.back.textContent = 'Back';

    btnResume.addEventListener('click', this.callbacks.resumeGame);
    bestScoreBtn.addEventListener('click', (e) => this.showBestScores(e));
    beginAgain.addEventListener('click', this.callbacks.beginAgain);
    saveGame.addEventListener('click', this.callbacks.saveGameHandler);
    loadGame.addEventListener('click', this.callbacks.loadGameHandler);
    this.back.addEventListener('click', (e) => this.returnMenu(e));

    this.sound.addEventListener('click', (e) => {
      this.callbacks.toggleSound(e);
      this.sound.textContent = this.sound.textContent === 'Sound: Off'
        ? 'Sound: On'
        : 'Sound: Off';
    });
  }

  createField() {
    this.winContainer = createElement('div', ['win-container'], this.body);
    this.canvasRow = createElement('div', ['row'], this.body);
  }

  createFooter() {
    const footer = createElement('footer', null, this.body);
    const quickStartBtn = createElement('button', ['quick-start'], footer);
    const select = createElement('select', ['select'], footer);
    const solution = createElement('button', ['solution'], footer);
    select.addEventListener('change', this.selectCallback);

    const options = createElement(
      'option',
      null,
      select,
      ['selected', ''],
      ['selected', 'selected'],
      ['disabled', 'disabled'],
      ['hidden', 'hidden'],
    );

    quickStartBtn.textContent = 'New Game';
    solution.textContent = 'Solve';
    options.textContent = 'Change field size ';

    Object.values(constants.PUZZLE_DIFFICULTY_LIST).forEach((size) => {
      const option = createElement('option', null, select, [
        'value',
        size,
      ]);
      option.textContent = `${size}x${size}`;

      quickStartBtn.addEventListener('click', this.callbacks.quickStart);
    });

    solution.addEventListener('click', this.callbacks.showSolution);
    select.addEventListener('change', this.callbacks.logValue);
  }

  appendCanvas(canvas) {
    this.canvasRow.append(canvas);
  }

  returnMenu(e) {
    this.menuContainer.classList.remove('hide');
    e.target.parentNode.classList.add('hide');
    // delete all temporary notifications
    if (e.target.parentNode.querySelector('.temporary')) {
      e.target.parentNode.removeChild(
        e.target.parentNode.querySelector('.temporary'),
      );
    }
  }

  showBestScores() {
    const curDifficulty = this.callbacks.getDifficulty();

    if (this.notificationText.classList.contains('zoom')) {
      this.notificationText.textContent = '';
      this.notificationText.classList.remove('zoom');
    }
    this.menuContainer.classList.add('hide');
    this.bestScoresContainer.classList.remove('hide');

    const bestScores = this.storage.get(`topScoresFor${curDifficulty}`);

    // clear previous information
    while (this.table.rows.length > 1) {
      this.table.deleteRow(1);
    }

    if (!bestScores) {
      const div = createElement(
        'div',
        ['temporary'],
        this.bestScoresContainer,
      );
      this.bestScoresContainer.insertBefore(div, this.back);
      div.textContent = 'No records';
    } else {
      const div = createElement(
        'div',
        ['temporary'],
        this.bestScoresContainer,
      );

      this.bestScoresContainer.insertBefore(div, this.table);
      div.textContent = `puzzle size: ${curDifficulty} x ${curDifficulty}`;

      bestScores.forEach((el) => {
        const tr = createElement('tr', null, this.table);
        constants.TABLE_HEADERS.forEach((name) => {
          const td = createElement('td', null, tr);
          td.textContent += `${el[name]} `;
        });
      });
    }
  }

  redrawCounter(moveCounter) {
    this.counter.textContent = moveCounter;
  }

  clearMenuNotification() {
    this.notificationText.textContent = '';
  }

  addAnimation(notificationText) {
    if (this.notificationText.classList.contains('zoom')) {
      this.notificationText.classList.remove('zoom');
    }

    // force browser to play animation again, set to null styles
    // eslint-disable-next-line no-void
    void this.notificationText.offsetWidth;

    this.notificationText.textContent = notificationText;
    this.notificationText.classList.add('zoom');
  }

  hideOverlay(isHide) {
    if (isHide) {
      this.overlay.classList.add('hide');
    } else {
      this.overlay.classList.remove('hide');
    }
  }

  removeWinNotification() {
    this.winContainer.textContent = '';
  }

  showWinNotification(time, moveCounter) {
    this.winContainer.textContent = `Ура! Вы решили головоломку за ${time} и ${moveCounter} ходов`;
  }
}
