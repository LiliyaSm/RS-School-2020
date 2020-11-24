import { cardsData } from "../utils/cardsData";

const mainPage = {
    categories: null,
    cards: document.querySelector(".cards"),
    loadPageById: null,

    init(loadPageById) {
        this.loadPageById = loadPageById;
        cardsData.loadData();
        this.categories = cardsData.getCategoriesList();
        this.generateMainPage(false);
    },

    generateMainPage(isTrainMode) {
        this.cards.textContent = "";

        let cardTemplate = document.getElementsByTagName("template")[1];

        this.categories.forEach((category, i) => {
            let clon = cardTemplate.content.cloneNode(true);
            clon.querySelector(".card").setAttribute("data-category", `${i}`);

            let name = cardsData.getCategoryImage(i);
            clon.querySelector(".card__image img").setAttribute(
                "src",
                `../assets/${name}`
            );

            clon.querySelector(".card__main-title").textContent = category;

            clon.querySelector(".card").addEventListener("click", (e) => {
                let categoryId = e.target
                    .closest(".card")
                    .getAttribute("data-category");

                this.loadPageById(categoryId);
            });

            this.cards.appendChild(clon);
        });
    },

    generateGame(isTrainMode) {
        viewBgImage(
            document.querySelectorAll(".card__main-title"),
            isTrainMode
        );
    },
};

function viewBgImage(data, isTrainMode) {

    data.forEach((element)=>{
        
        let src;
        if (isTrainMode) {
            src = "../assets/icons/hiclipart2.com.png";
        } else {            
            src = "../assets/icons/hiclipart1.com.png";
        }
        const img = document.createElement("img");
        img.src = src;
        img.onload = () => {
            element.style.backgroundImage = `url(${src})`;
        };
    })
}
export { mainPage };
