const body = document.querySelector("body");

const PUZZLE_DIFFICULTY = 4;

let tile = {
    width: 80,
    height: 80,
};



var winMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

//number position

var pos = {
    x: 0,
    y: 0,
    textx: 65,
    texty: 55,
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

function component(width, height, text, x, y, xNumber, yNumber) {
    ctx = myGameArea.context;
    ctx.fillStyle = "#EB5E55";
    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.fillRect(x + 5, y + 5, width - 10, height - 10);
    ctx.shadowColor = "transparent";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px Arial";
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
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
    myGamePiece = new component(tile.width, tile.height, "1", 0, 0, 35, 45);
};
