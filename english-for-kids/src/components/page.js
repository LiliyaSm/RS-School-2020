export default class Page {
    constructor(params) {
        this.mainContainer = document.querySelector(".main-wrapper");
    }
    renderPage() {}
    leavePage() {
        this.mainContainer.textContent = "";
    }
}
