export default class Page {
  constructor() {
    this.mainContainer = document.querySelector('.main-wrapper');
  }

  //   renderPage() {}

  leavePage() {
    document.querySelector('.toggle').classList.remove('hide');
    this.mainContainer.textContent = '';
  }
}
