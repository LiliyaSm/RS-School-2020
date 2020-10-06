const body = document.querySelector("body");

const PUZZLE_DIFFICULTY = 4;
const SIZE = 80;
let winMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

var tilePosition = {
    x: 0,
    y: 0,
    //number position
    textx: 35,
    texty: 45,
};

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

function createTiles() {
    let pieces = [];

    for (let i = 0; i < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY; i++) {
        pieces.push(winMap[i]);
        //empty tile
        if (winMap[i] === 0) {
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
            winMap[i],
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
    createTiles(); 
};
