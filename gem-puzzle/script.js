const body = document.querySelector("body");

const PUZZLE_DIFFICULTY = 3;
const SIZE = 80; //width, height
const minShuffle = 100;
const maxShuffle = 300;
// let winMap = createWinMap();
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
    constructor() {
        this.winMap = this.createWinMap();
        this.shuffleMap = this.shuffleTiles(this.winMap);
        this.drag - false;
    }
    shuffleMap = this.shuffleMap;
    // get shuffleMap() {
    //     return this._shuffleMap;
    // }

    set shuffleMap(newArray) {
        this.shuffleMap = newArray;
    }

    createWinMap() {
        //  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
        let arraySize = PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY;
        let result = [...Array(arraySize + 1).keys()].slice(1);
        result[arraySize - 1] = 0;
        return result;
    }

    shuffleTiles(winMap) {
        this.shuffleArray = [...this.winMap];
        // let emptyTilePosition = shuffleArray.indexOf("0");
        let shifts = ["left", "right", "up", "down"];
        let rand = Math.floor(
            Math.random() * (maxShuffle - minShuffle) + minShuffle
        ); // get random number between 50 and 100

        //repeat rand times
        Array.from(Array(rand)).forEach(() => {
            let randOperation = Math.floor(Math.random() * shifts.length); // get random number between 0 and 3
            let operation = shifts[randOperation];
            let emptyTilePosition = this.shuffleArray.indexOf(0);

            let row = Math.floor(emptyTilePosition / PUZZLE_DIFFICULTY);
            let col = emptyTilePosition % PUZZLE_DIFFICULTY;
            switch (operation) {
                case "left":
                    if (col !== 0) {
                        this.left(emptyTilePosition);
                    }
                    break;

                case "right":
                    if (col !== PUZZLE_DIFFICULTY - 1) {
                        this.right(emptyTilePosition);
                    }
                    break;
                case "up":
                    if (row !== 0) {
                        this.up(emptyTilePosition);
                    }
                    break;
                case "down":
                    if (row !== PUZZLE_DIFFICULTY - 1) {
                        this.down(emptyTilePosition);
                    }
                    break;
            }
        });
        return this.shuffleArray;
    }

    getMousePos(event) {
        let rect = this.canvas.getBoundingClientRect(); // abs. size of element
        //mouse position subtracted from the parent element's offset position, mouse position you are getting is relative to the client window
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        let col = Math.floor(x / SIZE);
        let row = Math.floor(y / SIZE);

        let emptyTilePosition = this.shuffleMap.indexOf(0);
        // let shuffleMap = this.shuffleMap;
        let rowEmptyTile = Math.floor(emptyTilePosition / PUZZLE_DIFFICULTY);
        let colEmptyTile = emptyTilePosition % PUZZLE_DIFFICULTY;

        if (
            col === colEmptyTile &&
            (rowEmptyTile + 1 === row || rowEmptyTile - 1 === row)
        ) {
            // shift in column
            if (rowEmptyTile + 1 === row) {
                this.down(emptyTilePosition);
            } else {
                this.up(emptyTilePosition);
            }
        } else if (
            row === rowEmptyTile &&
            (colEmptyTile + 1 === col || colEmptyTile - 1 === col)
        ) {
            // shift in row
            if (colEmptyTile + 1 === col) {
                this.right(emptyTilePosition);
            } else {
                this.left(emptyTilePosition);
            }
        }

        // myGameArea.createTiles(this.shuffleMap);
        if (arraysEqual(this.winMap, this.shuffleMap)) {
            console.log("win");
        }
    }

    left(emptyTilePosition) {
        this.shuffleArray[emptyTilePosition] = this.shuffleArray[
            emptyTilePosition - 1
        ];
        this.shuffleArray[emptyTilePosition - 1] = 0;
    }
    right(emptyTilePosition) {
        this.shuffleArray[emptyTilePosition] = this.shuffleArray[
            emptyTilePosition + 1
        ];
        this.shuffleArray[emptyTilePosition + 1] = 0;
    }

    down(emptyTilePosition) {
        this.shuffleArray[emptyTilePosition] = this.shuffleArray[
            emptyTilePosition + PUZZLE_DIFFICULTY
        ];
        this.shuffleArray[emptyTilePosition + PUZZLE_DIFFICULTY] = 0;
    }

    up(emptyTilePosition) {
        this.shuffleArray[emptyTilePosition] = this.shuffleArray[
            emptyTilePosition - PUZZLE_DIFFICULTY
        ];
        this.shuffleArray[emptyTilePosition - PUZZLE_DIFFICULTY] = 0;
    }

    beginAgainFunc() {
        this.shuffleMap = this.shuffleTiles(this.winMap);
        // myGameArea.createTiles(this.shuffleMap);
    }

    canvas = document.createElement("canvas");
    context = this.canvas.getContext("2d");
    start() {
        this.canvas.width = SIZE * PUZZLE_DIFFICULTY;
        this.canvas.height = SIZE * PUZZLE_DIFFICULTY;
        // document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        second_row.appendChild(this.canvas);
        // this.createTiles(array);
        //updates every 20th millisecond (50 times per second)
        return setInterval(this.createTiles.bind(this), 20);
    };

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    //draws tiles for array [1, 3, 2, ...]
    createTiles() {
        let array = this.shuffleArray;
        this.clear();
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
            let ctx = this.context;
            new component(
                ctx,
                SIZE,
                array[i],
                startPosition.x + col * SIZE,
                startPosition.y + row * SIZE
            );
        }
    }

    myMove(e) {
        if (dragok) {
            x = e.pageX - this.canvas.offsetLeft;
            y = e.pageY - this.canvas.offsetTop;
        }
    }

    myDown(event) {
        // if (
        //     e.pageX < x + 15 + this.canvas.offsetLeft &&
        //     e.pageX > x - 15 + this.canvas.offsetLeft &&
        //     e.pageY < y + 15 + this.canvas.offsetTop &&
        //     e.pageY > y - 15 + this.canvas.offsetTop
        // ) {
            let rect = this.canvas.getBoundingClientRect(); // abs. size of element
            //mouse position subtracted from the parent element's offset position, mouse position you are getting is relative to the client window
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            let col = Math.floor(x / SIZE);
            let row = Math.floor(y / SIZE);

            let neWx = event.pageX - this.canvas.offsetLeft;
            let neWy = event.pageY - this.canvas.offsetTop;
            this.drag = true;
            this.canvas.onmousemove = this.myMove;
        // }
    }
}

let myGameArea = {};

function component(ctx, size, text, x, y) {
    // ctx = myGameArea.context;
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
    ctx.draggable = true;
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

function updateGameArea() {
    // myGameArea.clear();
    // myGamePiece.x += 1;
    // myGamePiece.update();
}

document.body.onload = function () {
    let shuffleMap = new ShuffleMap();
    shuffleMap.start();
    // myGameArea.createTiles(shuffleMap.shuffleMap);
    shuffleMap.canvas.addEventListener("click", (e) =>
        shuffleMap.getMousePos(e)
    );
    shuffleMap.canvas.addEventListener("mousedown", (e) =>
        shuffleMap.myDown(e)
    );

    shuffleMap.canvas.onmousedown = shuffleMap.myDown;
    beginAgain.addEventListener("click", (e) => shuffleMap.beginAgainFunc(e));
};
