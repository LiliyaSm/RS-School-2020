import { cardsData } from '../utils/cardsData';
import comparer from '../utils/helpers';
import Page from './page';
import createElement from '../utils/createElement';
import * as constants from '../data/constants';

export default class StatisticsPage extends Page {
  constructor(storage) {
    super();
    this.tableRows = [];
    this.asc = true;
    this.storage = storage;
    this.resetBtn = null;
  }

  init() {
    document.body.addEventListener(
      constants.CUSTOM_EVENT_NAME.statistics,
      (e) => this.updateStaticsHandler(e),
    );
  }

  renderPage() {
    this.generateHTML();
    this.getStatistics();
    this.createTable();
    this.sorting();
  }

  createTable() {
    const table = createElement(
      'table',
      ['table', 'table-hover'],
      this.mainContainer,
      null,
      null,
    ).element;
    const thead = createElement('thead', null, table).element;
    const tr = createElement('tr', null, thead).element;

    constants.TABLE_HEADERS.forEach((name, i) => {
      let th;
      if (i === 0) {
        th = createElement('th', ['sorting_asc'], tr).element;
      } else {
        th = createElement('th', null, tr).element;
      }
      th.textContent = name;
    });
    const tbody = createElement('tbody', null, table).element;

    this.tableRows.forEach((row) => {
      const bodyRow = createElement('tr', null, tbody).element;
      constants.TABLE_HEADERS.forEach((tableHeader) => {
        const td = createElement('td', null, bodyRow).element;
        td.textContent += `${row[tableHeader]} `;
      });
    });
  }

  sorting() {
    document.querySelectorAll('th').forEach((th) => {
      th.addEventListener('click', (e) => {
        const table = th.closest('table');
        const tbody = table.querySelector('tbody');
        const thBgr = table.querySelector('[class*="sorting"]');

        if (thBgr) {
          thBgr.className = thBgr.className.replace(
            /sorting.+?/g,
            '',
          );
        }
        Array.from(table.querySelectorAll('tbody tr'))
          .sort(
            comparer(
              Array.from(th.parentNode.children).indexOf(th),
              (this.asc = !this.asc),
            ),
          )
          .forEach((tr) => tbody.appendChild(tr));

        e.target.className = this.asc ? 'sorting_asc' : 'sorting_desc';
      });
    });
  }

  updateStaticsHandler(e) {
    this.getStatistics();
    const { word } = e.detail;
    const { statisticsField } = e.detail;
    const updatedRow = this.tableRows.find((row) => row.word === word);
    updatedRow[statisticsField] += 1;
    this.storage.set(this.tableRows);
  }

  resetStatistics() {
    this.resetTable();
    this.writeEmptyStatistics();
    this.mainContainer.textContent = '';
    this.createTable();
    this.sorting();
  }

  resetTable() {
    this.tableRows = [];
    this.asc = true;
  }

  generateHTML() {
    super.hideToggle();
    const buttons = document.querySelector('.buttons');
    this.diffWordsBtn = createElement(
      'button',
      ['statistics-button', 'repeat'],
      buttons,
      null,
      [['click', (e) => this.redirectToCardPage(e)]],
    ).element;
    this.diffWordsBtn.textContent = 'Repeat difficult words';

    this.resetBtn = createElement(
      'button',
      ['statistics-button', 'reset'],
      buttons,
      null,
      [['click', (e) => this.resetStatistics(e)]],
    ).element;
    this.resetBtn.textContent = 'Reset';
  }

  clearHTML() {
    this.resetBtn.remove();
    this.diffWordsBtn.remove();
  }

  leavePage() {
    super.leavePage();
    this.resetTable();
    this.clearHTML();
  }

  writeEmptyStatistics() {
    const list = cardsData.getCategoriesList();
    list.forEach((category) => {
      const categoryObjects = cardsData.getCategoryCards(category);
      categoryObjects.forEach((obj) => {
        this.tableRows.push({
          category,
          word: obj.word,
          translation: obj.translation,
          train: constants.DEFAULT_STAT,
          play: constants.DEFAULT_STAT,
          errors: constants.DEFAULT_STAT,
        });
      });
    });
    this.tableRows = StatisticsPage.calculatePercentage(this.tableRows);
    this.storage.set(this.tableRows);
  }

  getStatistics() {
    const statistics = this.storage.get();
    if (statistics === null) {
      this.writeEmptyStatistics();
    } else {
      this.tableRows = StatisticsPage.calculatePercentage(statistics);
    }
  }

  static calculatePercentage(statistics) {
    return statistics.map((obj) => {
      const clone = { ...obj };
      const percent = Math.floor(
        (obj.errors / (obj.play + obj.errors)) * 100,
      );
      clone['% errors'] = Number.isNaN(percent) ? 0 : percent;
      return clone;
    });
  }

  redirectToCardPage() {
    const difficultWords = this.getDifficultWords();
    const navigate = new CustomEvent(constants.CUSTOM_EVENT_NAME.navigate, {
      detail: {
        pageName: constants.CARD_PAGE_NAME,
        params: { wordsToGenerate: difficultWords },
      },
      bubbles: true,
    });
    document.body.dispatchEvent(navigate);
  }

  getDifficultWords() {
    this.tableRows.sort((a, b) => (a['% errors'] < b['% errors'] ? 1 : -1));
    const difficultWords = [];
    const list = this.tableRows.filter((row) => row['% errors'] > 0);
    const difficultWordsLength = constants.REPEAT_WORD_NUMBER > list.length
      ? list.length
      : constants.REPEAT_WORD_NUMBER;
    for (let i = 0; i < difficultWordsLength; i++) {
      difficultWords.push(
        cardsData.getCardObject(list[i].category, list[i].word),
      );
    }
    return difficultWords;
  }
}
