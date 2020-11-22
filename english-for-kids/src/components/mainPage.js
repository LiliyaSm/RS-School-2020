
import { cardsData } from "../utils/cardsData";


const mainPage = {

    categories = null,

    init() {
        cardsData.loadData();
        this.categories = cardsData.getCategotiesList;
        this.generateMainPage()
    },

    generateMainPage(){
        
    }
};