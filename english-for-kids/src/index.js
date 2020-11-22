import { Menu } from "./components/menu";
import { Card } from "./components/card";

window.addEventListener("DOMContentLoaded", ()=> {
    Menu.init();
    Card.init(0);

    let menuIcon = document.querySelector(".navigation__icon");
    let overlay = document.querySelector(".overlay");

    //   let Menu = document.querySelector(".navigation__menu");



      overlay.addEventListener("click", function (event) {
          Menu.closeMenu();
      });
});
