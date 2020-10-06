const body = document.querySelector("body");

const PUZZLE_DIFFICULTY = 4;
const SIZE = 80;
const minShuffle = 100;
const maxShuffle = 300;
let winMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

var tilePosition = {
    x: 0,
    y: 0,
    //number position
    textx: 35,
    texty: 45,
};

function shuffleTiles(winMap) {
    let shuffleArray = [...winMap];
    // let emptyTilePosition = shuffleArray.indexOf("0");
    let shifts = ["left", "right", "up", "down"];
    let rand = Math.floor(Math.random() * (maxShuffle - minShuffle) + minShuffle); // get random number between 50 and 100

    //repeat rand times
    Array.from(Array(rand)).forEach((x, i) => {
        let randOperation = Math.floor(Math.random() * PUZZLE_DIFFICULTY); // get random number between 0 and 3
        let operation = shifts[randOperation];
        let emptyTilePosition = shuffleArray.indexOf(0);
        let row = Math.floor(emptyTilePosition / 4);
        let col = emptyTilePosition % 4;
        switch (operation) {
            case "left":
                if (col !== 0) {
                    // let temp = shuffleArray[emptyTilePosition - 1];
                    shuffleArray[emptyTilePosition] =
                        shuffleArray[emptyTilePosition - 1];
                        
                    shuffleArray[emptyTilePosition - 1] = 0;
                    break;
                } else {
                    break;
                }
            case "right":
                if (col !== PUZZLE_DIFFICULTY - 1) {
                    shuffleArray[emptyTilePosition] =
                        shuffleArray[emptyTilePosition + 1];
                    shuffleArray[emptyTilePosition + 1] = 0;
                    break;
                } else {
                    break;
                }
            case "up":
                if (row !== 0) {
                    shuffleArray[emptyTilePosition] =
                        shuffleArray[emptyTilePosition - PUZZLE_DIFFICULTY];
                    shuffleArray[emptyTilePosition - PUZZLE_DIFFICULTY] = 0;
                    break;
                } else {
                    break;
                }
            case "down":
                if (row !== PUZZLE_DIFFICULTY - 1) {
                    shuffleArray[emptyTilePosition] =
                        shuffleArray[emptyTilePosition + PUZZLE_DIFFICULTY];
                    shuffleArray[emptyTilePosition + PUZZLE_DIFFICULTY] = 0;
                    break;
                } else {
                    break;
                }
        }
    });
    return shuffleArray;
}

let myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 320;
        this.canvas.height = 320;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        //updates every 20th millisecond (50 times per second)
        // this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
};

//draws tiles for array [1, 3, 2, ...]
function createTiles(array) {
    let pieces = [];

    for (let i = 0; i < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY; i++) {
        pieces.push(array[i]);
        //empty tile
        if (array[i] === 0) {
            continue;
        }
        // i:         0 1 2 3 4 5 itc
        // i / 4      0 0 0 0
        //            1 1 1 1
        let row = Math.floor(i / 4);
        // i % 4      0 1 2 3 0 1 2 3
        let col = i % 4;

        myGamePiece = new component(
            SIZE,
            array[i],
            tilePosition.x + col * 80,
            tilePosition.y + row * 80
        );
        console.log(pieces);
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

function updateGameArea() {
    // myGameArea.clear();
    // myGamePiece.x += 1;
    // myGamePiece.update();
}

document.body.onload = function () {
    myGameArea.start();
    // shuffleTiles();
    createTiles(shuffleTiles(winMap));

};
