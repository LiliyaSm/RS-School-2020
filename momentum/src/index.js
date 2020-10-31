import "./scss/style.scss";
// require("html-loader!./index.html");
import "core-js/stable";
import "regenerator-runtime/runtime";

import { KEY } from "./key.js";

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

const imagesSet = 6;

const seasons = ["morning", "day", "evening", "night"];

// DOM Elements
const greeting = document.querySelector(".greeting"),
    name = document.querySelector(".name"),
    blockquote = document.querySelector("blockquote"),
    figcaption = document.querySelector("figcaption"),
    btnQuote = document.querySelector(".btnQuote"),
    focus = document.querySelector(".focus");

const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const city = document.querySelector(".city");
const windSpeed = document.querySelector(".wind-speed");
const humidity = document.querySelector(".humidity");

// Add Zeros
function addZero(n) {
    return (parseInt(n, 10) < 10 ? "0" : "") + n;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

class Momentum {
    constructor() {
        this.seasonNumber = null;
        this.i = 0;
        this.date = null;
        this.time = null;
        this.shuffleArray = null;
        this.lastChange = -1;
    }

    init() {
        this.date = document.querySelector(".date");
        this.time = document.querySelector(".time");

        this.shuffleArray = shuffle(
            [...Array(imagesSet).keys()].map((x) => ++x)
        );

        this.showTime();
        this.setBSeason();
        this.loadByNumber();
        const btnImage = document.querySelector(".btnImage");
        btnImage.addEventListener("click", (e) => {
            this.loadByNumber();
            this.blockBtn(e);
        });
    }
    blockBtn(e) {
        e.target.disabled = true;
        e.target.classList.add("disabled");
        setTimeout(function () {
            e.target.disabled = false;
            e.target.classList.remove("disabled");
        }, 700);
    }

    // Show Time
    showTime() {
        const today = new Date();
        const month = months[today.getMonth()];
        const dayMonth = today.getDate();
        // 0 (воскресенье) до 6 (суббота)
        const weekDay = days[today.getDay()];
        const hour = today.getHours();
        const min = today.getMinutes();
        const sec = today.getSeconds();

        // Output Time
        this.date.innerHTML = `${weekDay}<span>, </span>${dayMonth} ${month}`;

        this.time.innerHTML = `${hour}<span>:</span>${addZero(
            min
        )}<span>:</span>${addZero(sec)}`;
        
        // skip on initial run
        if(this.lastChange == -1){
            this.lastChange = hour;
        }else if (this.lastChange != hour) {
            //every new hour
            this.lastChange = hour;
            // console.log(hour, min, sec);
            this.setBSeason();
            this.loadByNumber(true);
            getWeather(); // update the weather
        }
        setTimeout(() => this.showTime(), 1000);
    }

    loadByNumber(sameDayTime) {
        //sameDayTime - do not change day of time, iterate inside the same
        const imageSrc = this.getImageNumber(sameDayTime);
        this.viewBgImage(imageSrc);
    }

    // Set Background and Greeting
    setBSeason() {
        let today = new Date(),
            hour = today.getHours();
        let currSeason = this.seasonNumber;

        if (hour > 5 && hour < 12) {
            // Morning
            this.seasonNumber = 0;
            greeting.textContent = "Good Morning, ";
        } else if (hour < 6) {
            //night
            this.seasonNumber = 3;
            greeting.textContent = "Good Night, ";
        } else if (hour < 18) {
            // Day
            this.seasonNumber = 1;
            greeting.textContent = "Good Afternoon, ";
        } else {
            // Evening
            this.seasonNumber = 2;
            greeting.textContent = "Good Evening, ";
        }

        if (currSeason !== this.seasonNumber) {
            this.i = 0;
            this.shuffleArray = shuffle(
                [...Array(imagesSet).keys()].map((x) => ++x)
            );
        }
    }

    viewBgImage(imageSrc) {
        const body = document.querySelector("body");
        const img = document.createElement("img");
        img.src = imageSrc;
        img.onload = () => {
            body.style.backgroundImage = `url(${imageSrc})`;
        };
    }

    getImageNumber(sameDayTime) {
        let season = seasons[this.seasonNumber];

        if (this.i > imagesSet - 1) {
            if (!sameDayTime) {
                this.seasonNumber = (this.seasonNumber + 1) % seasons.length;
                season = seasons[this.seasonNumber];
                this.i = this.i - imagesSet;
                this.shuffleArray = shuffle(
                    [...Array(imagesSet).keys()].map((x) => ++x)
                );
            } else {
                this.i = this.i - imagesSet;
            }
        }
        let randomNumber = this.shuffleArray[this.i];
        // console.log(randomNumber);
        this.i = this.i + 1;

        let formatNumber = (randomNumber < 10 ? "0" : "") + randomNumber;
        let src = `./assets/images/${season}/${formatNumber}.jpg`;
        return src;
    }
}

// Get Name
function getName() {
    //returns name if exists in storage
    if (localStorage.getItem("nameM") === null) {
        name.value = "[Enter Name]";
    } else {
        name.value = localStorage.getItem("nameM");
    }
}

// Set Name
function setName(e) {
    if (e.type === "keypress") {
        // Make sure enter is pressed
        if (e.which == 13 || e.keyCode == 13) {
            name.value = e.target.value.trim();
            if (e.target.value != "") {
                localStorage.setItem("nameM", e.target.value);
            } else {
                getName();
            }
            resizeInput.call(name);
            name.blur();
        }
    } else if (e.type === "focus") {
        name.value = "";
    } else {
        // blur
        name.value = e.target.value.trim();
        if (e.target.value != "") {
            localStorage.setItem("nameM", e.target.value);
        } else {
            getName();
        }
        resizeInput.call(name);
    }
}

function resizeInput() {
    this.style.width = this.value.length + "ch";
}

// Get Focus
function getFocus() {
    if (localStorage.getItem("focusM") === null) {
        focus.textContent = "[Enter Focus]";
    } else {
        focus.textContent = localStorage.getItem("focusM");
    }
}

// Set Focus
function setFocus(e) {
    if (e.type === "keypress") {
        // Make sure enter is pressed
        if (e.which == 13 || e.keyCode == 13) {
            focus.textContent = e.target.innerText.trim();
            if (e.target.innerText != "") {
                localStorage.setItem("focusM", e.target.innerText);
            } else {
                getFocus();
            }
            focus.blur();
        }
    } else if (e.type === "focus") {
        focus.textContent = "";
    } else {
        focus.textContent = e.target.innerText.trim();
        if (e.target.innerText != "") {
            localStorage.setItem("focusM", e.target.innerText);
        } else {
            getFocus();
        }
    }
}

function getCity() {
    if (localStorage.getItem("cityM") === null) {
        city.textContent = "[Enter City]";
        weatherDescription.textContent = "";
        windSpeed.textContent = "";
        humidity.textContent = "";
        weatherIcon.className = "weather-icon owf";
        temperature.textContent = "";
    } else {
        city.textContent = localStorage.getItem("cityM");
    }
}

function setCity(e) {
    if (e.type === "keypress") {
        // Make sure enter is pressed
        if (e.which == 13 || e.keyCode == 13) {
            city.textContent = e.target.innerText.trim();
            if (e.target.innerText != "") {
                localStorage.setItem("cityM", e.target.innerText);
                getWeather();
            } else {
                getCity();
            }
            city.blur();
        }
    } else if (e.type === "focus") {
        city.textContent = "";
    } else {
        city.textContent = e.target.innerText.trim();
        if (e.target.innerText != "") {
            localStorage.setItem("cityM", e.target.innerText);
            getWeather();
        } else {
            getCity();
        }
    }
}

// get quotes
async function getQuote() {
    const url = `https://programming-quotes-api.herokuapp.com/quotes/random/lang/sr`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.en.length > 200) {
        getQuote();
    } else {
        blockquote.innerHTML = `<span> <i> ${data.en} </i> </span>`;
        figcaption.innerHTML = `<span> <i> ${data.author} </i> </span>`;
    }
}

// get weather
async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=en&appid=${KEY}&units=metric`;
    const res = await fetch(url);
    if (res.status === 200) {
        const data = await res.json();
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `Temperature: ${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        windSpeed.textContent = `Wind speed: ${data.wind.speed}`;
        humidity.textContent = `Humidity: ${data.main.humidity}%`;
    } else {
        weatherDescription.textContent = "City not found";
        windSpeed.textContent = "";
        humidity.textContent = "";
        weatherIcon.className = "weather-icon owf";
        temperature.textContent = "";
    }

    if (city.textContent === "[Enter City]") {
        weatherDescription.textContent = "";
    }
}

name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);
name.addEventListener("focus", setName);
name.addEventListener("input", resizeInput); // bind the "resizeInput" callback on "input" event

focus.addEventListener("keypress", setFocus);
focus.addEventListener("blur", setFocus);
focus.addEventListener("focus", setFocus);

btnQuote.addEventListener("click", getQuote);

city.addEventListener("keypress", setCity);
city.addEventListener("blur", setCity);
city.addEventListener("focus", setCity);

city.addEventListener("keydown", (event) => {
    if (city.innerText.length === 25 && event.keyCode != 8) {
        event.preventDefault();
    }
});

focus.addEventListener("keydown", (event) => {
    if (focus.innerText.length === 25 && event.keyCode != 8) {
        event.preventDefault();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    let momentum = new Momentum();
    momentum.init();
    getCity();
    getWeather();
    getQuote();
    getName();
    resizeInput.call(name); // immediately call the function
    getFocus();
});
