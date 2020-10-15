window.addEventListener("DOMContentLoaded", function () {

    let overlay = document.querySelector(".overlay");
    let mobileMenu = document.querySelector(".mobile-menu");
    let menuIcon = document.querySelector(".menu-icon");
    // let mobileLogo = document.querySelector("#mobile-logo");

    menuIcon.addEventListener("click", function (event) {
        // let overlay = document.querySelector(".overlay");
        mobileMenu.classList.toggle("slide");
        mobileMenu.classList.toggle("hide-menu");
        overlay.classList.toggle("hide");
        menuIcon.classList.toggle("rotate");
         
    });

    document
        .querySelector(".overlay")
        .addEventListener("click", function (event) {
            mobileMenu.classList.toggle("hide-menu");
            overlay.classList.toggle("hide");
            mobileMenu.classList.toggle("slide");
            menuIcon.classList.toggle("rotate");


        });

    // document
    //     .querySelector(".menu-icon")
    //     .addEventListener("click", function (event) {
    //     let mobileMenu = document.querySelector(".mobile-menu");
    //     let overlay = document.querySelector(".overlay");
    //     mobileMenu.classList.add("hide-menu");
    //     mobileMenu.classList.remove("slide");

    //     });

    // $("#dismiss").on("click", function () {
    //     // hide sidebar
    //     $(".navbar-collapse").addClass("hide-menu");
    //     $(".navbar-collapse").removeClass("slide");
    //     $(".overlay").addClass("collapse");
    // });
});
