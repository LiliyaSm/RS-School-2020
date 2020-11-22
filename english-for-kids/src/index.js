import { Menu } from "./components/menu";
import { mainPage } from "./components/mainPage";

window.addEventListener("DOMContentLoaded", ()=> {
    Menu.init();
    mainPage.init();

    let menuIcon = document.querySelector(".navigation__icon");
    let overlay = document.querySelector(".overlay");

    //   let Menu = document.querySelector(".navigation__menu");



      overlay.addEventListener("click", function (event) {
          Menu.closeMenu();
      });
});
