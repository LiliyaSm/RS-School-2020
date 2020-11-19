import { Menu } from "./components/menu";

window.addEventListener("DOMContentLoaded", ()=> {
    Menu.init();

    let menuIcon = document.querySelector(".navigation__icon");

      let overlay = document.querySelector(".overlay");

    //   let Menu = document.querySelector(".navigation__menu");

    menuIcon.addEventListener("click", function (event) {
        Menu.toggleMenu();
    });

      overlay.addEventListener("click", function (event) {
          Menu.closeMenu();
          overlay.classList.toggle("hide");
      });
});
