export default class Page {
    constructor(params) {
        this.mainContainer = document.querySelector(".main-wrapper");
    }
    // either integrate in renderpage or call in main.page.init
    init(){}
    renderPage() {}
    leavePage() {
        this.mainContainer.textContent = "";
    }
}
