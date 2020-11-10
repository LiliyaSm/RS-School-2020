import images from './images.js';

const startPosition = {
  x: 0,
  y: 0,
};

//   const keyButton = new Key(keyObj);

export default class CreateField {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    // this.context = null;
    this.SIZE = null;
    this.PUZZLE_DIFFICULTY = null;
    this.pieces = [];
    this.img = new Image();
    this.img.counter = 0;
    this.initArray = null;
  }

  init(SIZE, PUZZLE_DIFFICULTY, array, saveImage) {
    this.PUZZLE_DIFFICULTY = PUZZLE_DIFFICULTY;
    this.SIZE = SIZE;
    this.canvas.width = this.SIZE * this.PUZZLE_DIFFICULTY;
    this.canvas.height = this.SIZE * this.PUZZLE_DIFFICULTY;

    // this.img = new Image();
    if (!saveImage) {
      this.img.counter = ++this.img.counter % 150;
    }

    this.img.src = `../assets/${this.img.counter}.jpg`;
    this.img.addEventListener('load', (e) => this.loadImage(e));

    this.initArray = array;

    this.pieces = [];
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  loadImage() {
    this.pieceWidth = Math.floor(this.img.width / this.PUZZLE_DIFFICULTY);
    this.pieceHeight = Math.floor(this.img.height / this.PUZZLE_DIFFICULTY);

    let i;
    let piece;

    for (i = 0; i < this.PUZZLE_DIFFICULTY * this.PUZZLE_DIFFICULTY; i++) {
      piece = {};
      const row = Math.floor(i / this.PUZZLE_DIFFICULTY);
      // i % 4      0 1 2 3 0 1 2 3
      const col = i % this.PUZZLE_DIFFICULTY;

      piece.sx = startPosition.x + col * this.pieceWidth;
      piece.sy = startPosition.y + row * this.pieceHeight;
      this.pieces.push(piece);
    }
    this.createTiles(this.initArray);
  }

  createTiles(array, animated, dragPosition, dragX, dragY) {
    this.clear();
    for (let i = 0; i < array.length; i++) {
      // empty tile
      if (array[i] === 0) {
        continue;
      }

      if (animated && dragPosition === i) {
        // draw separately dragging tile
        continue;
      }

      // i:         0 1 2 3 4 5 itc
      // i / 4      0 0 0 0
      //            1 1 1 1
      const row = Math.floor(i / this.PUZZLE_DIFFICULTY);
      // i % 4      0 1 2 3 0 1 2 3
      const col = i % this.PUZZLE_DIFFICULTY;
      this.drawTile(
        this.SIZE,
        array[i],
        startPosition.x + col * this.SIZE,
        startPosition.y + row * this.SIZE,
      );
    }

    if (animated) {
      this.drawTile(this.SIZE, array[dragPosition], dragX, dragY);
    }
  }

  drawTile(size, text, x, y) {
    const ctx = this.context;
    ctx.fillStyle = '#EB5E55';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    // ctx.fillRect(x + 5, y + 5, size - 5, size - 5);
    const imgCoords = this.pieces[text - 1];

    if (!imgCoords) debugger;

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
    ctx.drawImage(
      this.img,
      imgCoords.sx,
      imgCoords.sy,
      this.pieceWidth,
      this.pieceHeight,
      x + 3,
      y + 3,
      size - 7,
      size - 7,
    );
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    ctx.draggable = true;

    // compute text position
    const xNumber = x + 35;
    const yNumber = y + 45;
    ctx.fillText(text, xNumber, yNumber);
  }

  setImage(imageNumber) {
    this.img.counter = imageNumber;
  }

  getImage() {
    return this.img.counter;
  }

  winField(PUZZLE_DIFFICULTY, SIZE, fieldSize, counter, timer) {
    this.clear();

    this.PUZZLE_DIFFICULTY = PUZZLE_DIFFICULTY;
    this.SIZE = SIZE;

    this.canvas.width = this.SIZE * this.PUZZLE_DIFFICULTY;
    this.canvas.height = this.SIZE * this.PUZZLE_DIFFICULTY;

    this.context.drawImage(this.img, 0, 0, fieldSize, fieldSize);
    // const sec = this.totalSeconds % 60;
    // const min = parseInt(this.totalSeconds / 60);
    // const text = `Ура! Вы решили головоломку за ${min}:${sec} и ${counter} ходов`;
    // this.context.fillText(text, 15, 45);
  }
}
