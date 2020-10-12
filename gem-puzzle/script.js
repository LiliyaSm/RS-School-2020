const body = document.querySelector("body");

const PUZZLE_DIFFICULTY = 2;
const SIZE = 80; //width, height
const minShuffle = 100;
const maxShuffle = 300;
let winMap = createWinMap();
// let shuffleMap = shuffleTiles(winMap);

const startPosition = {
    x: 0,
    y: 0,
};

body.setAttribute("class", "container-fluid");

let first_row = document.createElement("div");
let second_row = document.createElement("div");
let div = document.createElement("div");
let beginAgain = document.createElement("button");
beginAgain.setAttribute("class", "beginAgain");
beginAgain.innerHTML = "Begin again";

first_row.setAttribute("class", "row");
first_row.appendChild(beginAgain);
body.appendChild(first_row);
second_row.setAttribute("class", "row");
body.appendChild(second_row);

// div.setAttribute("class", "col-lg-12 col-md-6 col-sm-6 align-self-center");

// second_row.appendChild(div);

class ShuffleMap {
    constructor(winMap) {
        this.winMap = winMap;
        this.shuffleMap = this.shuffleTiles(this.winMap);
    }
    shuffleMap = this.shuffleMap;
    // get shuffleMap() {
    //     return this._shuffleMap;
    // }

    set shuffleMap(newArray) {
        this.shuffleMap = newArray;
    }

    shuffleTiles(winMap) {
        let shuffleArray = [...this.winMap];
        // let emptyTilePosition = shuffleArray.indexOf("0");
        let shifts = ["left", "right", "up", "down"];
        let rand = Math.floor(
            Math.random() * (maxShuffle - minShuffle) + minShuffle
        ); // get random number between 50 and 100

        //repeat rand times
        Array.from(Array(rand)).forEach(() => {
            let randOperation = Math.floor(Math.random() * shifts.length); // get random number between 0 and 3
            let operation = shifts[randOperation];
            let emptyTilePosition = shuffleArray.indexOf(0);
            let row = Math.floor(emptyTilePosition / PUZZLE_DIFFICULTY);
            let col = emptyTilePosition % PUZZLE_DIFFICULTY;
            switch (operation) {
                case "left":
                    if (col !== 0) {
                        shuffleArray[emptyTilePosition] =
                            shuffleArray[emptyTilePosition - 1];
                        shuffleArray[emptyTilePosition - 1] = 0;
                    }
                    break;

                case "right":
                    if (col !== PUZZLE_DIFFICULTY - 1) {
                        shuffleArray[emptyTilePosition] =
                            shuffleArray[emptyTilePosition + 1];
                        shuffleArray[emptyTilePosition + 1] = 0;
                    }
                    break;
                case "up":
                    if (row !== 0) {
                        shuffleArray[emptyTilePosition] =
                            shuffleArray[emptyTilePosition - PUZZLE_DIFFICULTY];
                        shuffleArray[emptyTilePosition - PUZZLE_DIFFICULTY] = 0;
                    }
                    break;
                case "down":
                    if (row !== PUZZLE_DIFFICULTY - 1) {
                        shuffleArray[emptyTilePosition] =
                            shuffleArray[emptyTilePosition + PUZZLE_DIFFICULTY];
                        shuffleArray[emptyTilePosition + PUZZLE_DIFFICULTY] = 0;
                    }
                    break;
            }
        });
        return shuffleArray;
    }

    getMousePos(event) {
        let rect = myGameArea.canvas.getBoundingClientRect(); // abs. size of element
        //mouse position subtracted from the parent element's offset position, mouse position you are getting is relative to the client window
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        let col = Math.floor(x / SIZE);
        let row = Math.floor(y / SIZE);

        let emptyTilePosition = this.shuffleMap.indexOf(0);
        let shuffleMap = this.shuffleMap;
        let rowEmptyTile = Math.floor(emptyTilePosition / PUZZLE_DIFFICULTY);
        let colEmptyTile = emptyTilePosition % PUZZLE_DIFFICULTY;

        if (
            col === colEmptyTile &&
            (rowEmptyTile + 1 === row || rowEmptyTile - 1 === row)
        ) {
            // shift in column
            if (rowEmptyTile + 1 === row) {
                shuffleMap[emptyTilePosition] =
                    shuffleMap[emptyTilePosition + PUZZLE_DIFFICULTY];
                shuffleMap[emptyTilePosition + PUZZLE_DIFFICULTY] = 0;
            } else {
                shuffleMap[emptyTilePosition] =
                    shuffleMap[emptyTilePosition - PUZZLE_DIFFICULTY];
                shuffleMap[emptyTilePosition - PUZZLE_DIFFICULTY] = 0;
            }
        } else if (
            row === rowEmptyTile &&
            (colEmptyTile + 1 === col || colEmptyTile - 1 === col)
        ) {
            // shift in row
            if (colEmptyTile + 1 === col) {
                shuffleMap[emptyTilePosition] =
                    shuffleMap[emptyTilePosition + 1];
                shuffleMap[emptyTilePosition + 1] = 0;
            } else {
                shuffleMap[emptyTilePosition] =
                    shuffleMap[emptyTilePosition - 1];
                shuffleMap[emptyTilePosition - 1] = 0;
            }
        }

        createTiles(shuffleMap);
        if (arraysEqual(winMap, shuffleMap)) {
            console.log("win");
        }
    }
}

function createWinMap() {
    //  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    let arraySize = PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY;
    let result = [...Array(arraySize + 1).keys()].slice(1);
    result[arraySize - 1] = 0;
    return result;
}

let myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = SIZE * PUZZLE_DIFFICULTY;
        this.canvas.height = SIZE * PUZZLE_DIFFICULTY;
        this.context = this.canvas.getContext("2d");
        // document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        second_row.appendChild(this.canvas);

        //updates every 20th millisecond (50 times per second)
        // this.interval = setInterval(updateGameArea, 20);
    },

    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
};

//draws tiles for array [1, 3, 2, ...]
function createTiles(array) {
    myGameArea.clear();
    for (let i = 0; i < array.length; i++) {
        //empty tile
        if (array[i] === 0) {
            continue;
        }
        // i:         0 1 2 3 4 5 itc
        // i / 4      0 0 0 0
        //            1 1 1 1
        let row = Math.floor(i / PUZZLE_DIFFICULTY);
        // i % 4      0 1 2 3 0 1 2 3
        let col = i % PUZZLE_DIFFICULTY;

        myGamePiece = new component(
            SIZE,
            array[i],
            startPosition.x + col * SIZE,
            startPosition.y + row * SIZE
        );
    }
}

function component(size, text, x, y) {
    ctx = myGameArea.context;
    ctx.fillStyle = "#EB5E55";
    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.fillRect(x + 5, y + 5, size - 10, size - 10);
    ctx.shadowColor = "transparent";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px Arial";
    this.width = size;
    this.height = size;
    this.x = x;
    this.y = y;
    //compute text position
    xNumber = x + 35;
    yNumber = y + 45;
    ctx.fillText(text, xNumber, yNumber);

    this.update = function () {};
}


function arraysEqual(a, b) {
    //check if arrays are equal
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function beginAgainFunc() {
    myGameArea.start();
    let shuffleMap = shuffleTiles(winMap);
    createTiles(shuffleMap);
}

function updateGameArea() {
    // myGameArea.clear();
    // myGamePiece.x += 1;
    // myGamePiece.update();
}

document.body.onload = function () {
    myGameArea.start();
    let shuffleMap = new ShuffleMap(winMap);
    createTiles(shuffleMap.shuffleMap);
    myGameArea.canvas.addEventListener("mousedown", (e)=>shuffleMap.getMousePos(e));
    beginAgain.addEventListener("click", beginAgainFunc);
};
