const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

// DOM Elements
const time = document.querySelector(".time"),
    greeting = document.querySelector(".greeting"),
    name = document.querySelector(".name"),
    date = document.querySelector(".date"),
    focus = document.querySelector(".focus");

// Show Time
function showTime() {
    let today = new Date();

    // year = today.getFullYear();
    month = months[today.getMonth()];
    dayMonth = today.getDate();
    // 0 (воскресенье) до 6 (суббота)
    weekDay = days[today.getDay()];
    hour = today.getHours();
    min = today.getMinutes();
    sec = today.getSeconds();

    // Output Time
    date.innerHTML = `${weekDay}<span>, </span>${dayMonth} ${month}`;

    time.innerHTML = `${hour}<span>:</span>${addZero(
        min
    )}<span>:</span>${addZero(sec)}`;

    setTimeout(showTime, 1000);
}

// Add Zeros
function addZero(n) {
    return (parseInt(n, 10) < 10 ? "0" : "") + n;
}

// Set Background and Greeting
function setBgGreet() {
    let today = new Date(),
        hour = today.getHours();

    let number = getImageNumber();

    if (hour < 12) {
        // Morning
        document.body.style.backgroundImage = `url('./assets/images/morning/${number}.jpg')`;
        greeting.textContent = "Good Morning, ";
    } else if (hour < 18) {
        // Day
        document.body.style.backgroundImage = `url('./assets/images/day/${number}.jpg')`;
        greeting.textContent = "Good Afternoon, ";
    } else if (hour < 23) {
        // Evening
        document.body.style.backgroundImage = `url('./assets/images/evening/${number}.jpg')`;
        greeting.textContent = "Good Evening, ";
        document.body.style.color = "white";
        //night
    } else {
        document.body.style.backgroundImage = `url('./assets/images/night/${number}.jpg')`;

    }
}

// Get Name
function getName() {
    if (localStorage.getItem("name") === null) {
        name.textContent = "[Enter Name]";
    } else {
        name.textContent = localStorage.getItem("name");
    }
}

// Set Name
function setName(e) {
    if (e.type === "keypress") {
        // Make sure enter is pressed
        if (e.which == 13 || e.keyCode == 13) {
            localStorage.setItem("name", e.target.innerText);
            name.blur();
        }
    } else {
        localStorage.setItem("name", e.target.innerText);
    }
}

// Get Focus
function getFocus() {
    if (localStorage.getItem("focus") === null) {
        focus.textContent = "[Enter Focus]";
    } else {
        focus.textContent = localStorage.getItem("focus");
    }
}

// Set Focus
function setFocus(e) {
    if (e.type === "keypress") {
        // Make sure enter is pressed
        if (e.which == 13 || e.keyCode == 13) {
            localStorage.setItem("focus", e.target.innerText);
            focus.blur();
        }
    } else {
        localStorage.setItem("focus", e.target.innerText);
    }
}
// get random

function getImageNumber (){
    let number = Math.floor(Math.random() * (21 - 1) + 1);
    return (number < 10 ? "0" : "") + number;

    
}


name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);
focus.addEventListener("keypress", setFocus);
focus.addEventListener("blur", setFocus);

// Run
showTime();
setBgGreet();
getName();
getFocus();
