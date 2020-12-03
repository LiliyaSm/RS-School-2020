export default class Page {
  constructor() {
    this.mainContainer = document.querySelector('.main-wrapper');
    this.toggle = document.querySelector('.toggle');
  }

  hideToggle() {
    this.toggle.classList.add('hide');
  }

  leavePage() {
    this.toggle.classList.remove('hide');
    this.mainContainer.textContent = '';
  }
}
