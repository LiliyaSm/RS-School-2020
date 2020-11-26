import CreateField from './js/createField'; // creates canvas field
import Timer from './js/timer';
import BestScores from './js/bestScores';
import Audio from './js/audio';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import LocalStorage from './js/storage';
import GameHTML from './js/gameHTML';
import * as constants from './js/constants';
import Game from './js/game';
import createAnimation from './js/animation';

class GemPuzzle {
  constructor(defDifficulty) {
    this.puzzleDifficulty = defDifficulty;
    this.canvas = null;
    this.moveCounter = 0;
    this.timer = null;
    this.isWin = false;
    this.isLarge = true;
    this.fieldSize = constants.FIELD_SIZE_LARGE;
    this.size = this.fieldSize / this.puzzleDifficulty;
    this.gameHTML = null;
    this.bestScores = null;
    this.animation = {
      started: false,
      position: null,
      startX: 0,
      startY: 0,
    };

    this.solutionIsShowing = false;
    this.game = null;
  }

  beginAgainHandler() {
    this.resumeGameHandler();
    this.restart();
  }

  quickStartHandler() {
    if (this.solutionIsShowing) return;
    this.restart();
  }

  start() {
    this.calculateSize();
    this.tileRendering = new CreateField();
    this.bestScores = new BestScores(() => this.getDifficultyHandler());
    this.canvas = this.tileRendering.canvas;
    this.canvas.onmousedown = (e) => this.myDown(e);

    this.createHTML();
    this.audio = new Audio(this.gameHTML);
    this.audio.init();

    this.padding = constants.PADDING_LARGE;

    this.game = new Game(this.puzzleDifficulty);

    this.tileRendering.init(
      this.size,
      this.puzzleDifficulty,
      this.game.tiles,
      this.padding,
    );

    this.timer = new Timer(this.gameHTML);
    this.timer.start();

    window.addEventListener('resize', (e) => this.resizeField(e));
    this.resizeField();
  }

  createHTML() {
    this.gameHTML = new GameHTML(document.querySelector('body'), {
      logValue: (e) => this.logValueHandler(e),
      quickStart: (e) => this.quickStartHandler(e),
      beginAgain: (e) => this.beginAgainHandler(e),
      showSolution: (e) => this.showSolutionHandler(e),
      saveGameHandler: (e) => this.saveGameHandler(e),
      loadGameHandler: (e) => this.loadGameHandler(e),
      showMenu: (e) => this.showMenuHandler(e),
      toggleSound: (e) => this.audio.toggleSoundHandler(e),
      resumeGame: () => this.resumeGameHandler(),
      getDifficulty: (e) => this.getDifficultyHandler(e),
    });
    this.gameHTML.init();
    this.gameHTML.appendCanvas(this.canvas);
  }

  restart(saveImage) {
    if (this.isWin) {
      this.gameHTML.removeWinNotification();
      this.isWin = false;
    }
    this.solutionIsShowing = false;
    this.animation.started = false;

    this.game.restart(this.puzzleDifficulty);
    this.tileRendering.init(
      this.size,
      this.puzzleDifficulty,
      this.game.tiles,
      this.padding,
      saveImage,
    );
    this.canvas = this.tileRendering.canvas;

    this.resetCounter();
    this.timer.resetTimer();
  }

  getDifficultyHandler() {
    return this.puzzleDifficulty;
  }

  saveGameHandler() {
    if (this.isWin) {
      this.gameHTML.addAnimation("Can't be save!");
      return;
    }

    this.gameHTML.addAnimation('Game saved!');
    const savedGameObject = this.game.save();
    savedGameObject.timer = this.timer.getSeconds();
    savedGameObject.counter = this.moveCounter;
    savedGameObject.puzzleDifficulty = this.puzzleDifficulty;
    savedGameObject.imageNumber = this.tileRendering.getImage();

    LocalStorage.set('15gameObject', savedGameObject);
  }

  calculateSize() {
    this.size = this.fieldSize / this.puzzleDifficulty;
  }

  loadGameHandler() {
    if (this.isWin) {
      this.gameHTML.removeWinNotification();
      this.isWin = false;
    }
    this.solutionIsShowing = false;

    const savedGameObject = LocalStorage.get('15gameObject');
    this.game.load(savedGameObject);
    this.calculateSize();

    this.tileRendering.setImage(savedGameObject.imageNumber);

    this.tileRendering.init(
      this.size,
      this.puzzleDifficulty,
      this.game.tiles,
      this.padding,
      true,
    );

    this.moveCounter = savedGameObject.counter;
    this.gameHTML.redrawCounter(this.moveCounter);

    this.resumeGameHandler(savedGameObject.timer);

    this.canvas = this.tileRendering.canvas;
  }

  logValueHandler(e) {
    if (this.solutionIsShowing) return;
    this.puzzleDifficulty = Number(e.target.value);
    this.calculateSize();
    this.restart(true);
  }

  increaseCounter() {
    ++this.moveCounter;
    this.gameHTML.redrawCounter(this.moveCounter);
  }

  resetCounter() {
    this.moveCounter = 0;
    this.gameHTML.redrawCounter(this.moveCounter);
  }

  getPosition(pos) {
    return pos.row * this.puzzleDifficulty + pos.col;
  }

  renderAnimationFrame(pos) {
    this.tileRendering.createTiles(
      this.game.tiles,
      this.animation.started,
      this.animation.position,
      pos.x,
      pos.y,
    );
  }

  handleClick(e) {
    const tile = this.tileRendering.getColRow(e.clientX, e.clientY);
    const duration = constants.ANIMATION_SETTINGS.normDuration;

    this.animation.started = true;

    const emptyTile = this.game.getEmptyTileLocation();
    const moveCoords = this.calcMoveCoords(emptyTile, tile);

    createAnimation(
      moveCoords.from,
      moveCoords.to,
      duration,
      (pos) => this.renderAnimationFrame(pos),
      () => {
        this.animation.started = false;
        this.doTurnToDir(moveCoords.direction);
      },
    );
  }

  calcMoveCoords(empty, target) {
    // takes col and row of empty and target tiles
    // returns coords from, coords to and direction; need for clicking animation

    const { col, row } = target;
    const { col: emptyCol, row: emptyRow } = empty;
    const fromX = col * this.size + this.padding;
    const fromY = row * this.size + this.padding;
    let toX;
    let toY;
    let direction;

    if (
      col === emptyCol
            && (emptyRow + 1 === row || emptyRow - 1 === row)
    ) {
      // shift in column
      if (emptyRow + 1 === row) {
        toX = col * this.size + this.padding;
        toY = row * this.size - this.size + this.padding;
        direction = constants.DIRECTION.DOWN;
      } else {
        toX = col * this.size + this.padding;
        toY = row * this.size + this.size + this.padding;
        direction = constants.DIRECTION.UP;
      }
    } else if (
      row === emptyRow
            && (emptyCol + 1 === col || emptyCol - 1 === col)
    ) {
      // shift in row
      if (emptyCol + 1 === col) {
        toX = col * this.size - this.size + this.padding;
        toY = row * this.size + this.padding;
        direction = constants.DIRECTION.RIGHT;
      } else {
        toX = col * this.size + this.size + this.padding;
        toY = row * this.size + this.padding;
        direction = constants.DIRECTION.LEFT;
      }
    }

    return {
      from: {
        x: fromX,
        y: fromY,
      },
      to: {
        x: toX,
        y: toY,
      },
      direction,
    };
  }

  getRelativeCoordinates(e) {
    return {
      x: this.tileRendering.getRelativeX(e.clientX) - this.size / 2,
      y: this.tileRendering.getRelativeY(e.clientY) - this.size / 2,
    };
  }

  convertPositionToCoordinates(position) {
    return {
      x: position.col * this.size + this.padding,
      y: position.row * this.size + this.padding,
    };
  }

  handleMove(e) {
    // user mouse up above right position
    const { col, row } = this.tileRendering.getColRow(e.clientX, e.clientY);
    const position = this.getPosition({ col, row });
    const emptyTilePosition = this.game.tiles.indexOf(0);

    if (this.animation.started && position === emptyTilePosition) {
      const from = this.getRelativeCoordinates(e);
      const to = this.convertPositionToCoordinates({ col, row });
      createAnimation(
        from,
        to,
        constants.ANIMATION_SETTINGS.moveDuration,
        (pos) => this.renderAnimationFrame(pos),
        () => {
          this.animation.started = false;
          this.doTurnToPos(this.animation.position);
        },
      );
    } else {
      this.animateReturn(e);
    }
  }

  animateReturn(e) {
    // user mouse up above wrong position returns tile on initial place
    const initialPos = this.tileRendering.getColRow(
      this.animation.startX,
      this.animation.startY,
    );
    const from = this.getRelativeCoordinates(e);
    const to = this.convertPositionToCoordinates(initialPos);
    createAnimation(
      from,
      to,
      constants.ANIMATION_SETTINGS.moveHomeDuration,
      (pos) => this.renderAnimationFrame(pos),
      () => {
        this.animation.started = false;
        this.animation.position = null;
        this.audio.playSound('badClick');
      },
    );
  }

  doTurnToDir(direction) {
    const emptyTilePosition = this.game.tiles.indexOf(0);
    const targetPos = this.game.useDirection(emptyTilePosition, direction);
    this.doTurnToPos(targetPos);
  }

  doTurnToPos(pos) {
    this.game.moveToPos(pos);
    this.increaseCounter();
    this.audio.playSound('click');
    this.checkIfWin();
  }

  tileIsMoving(e) {
    const diffX = Math.abs(e.clientX - this.animation.startX);
    const diffY = Math.abs(e.clientY - this.animation.startY);
    return (
      diffX > constants.DRAG_SENSITIVITY
            || diffY > constants.DRAG_SENSITIVITY
    );
  }

  myMove(e) {
    if (this.tileIsMoving(e)) {
      this.animation.started = true;
      const coords = this.getRelativeCoordinates(e);

      this.tileRendering.createTiles(
        this.game.tiles,
        this.animation.started,
        this.animation.position,
        coords.x,
        coords.y,
      );
    }
  }

  myDown(e) {
    const initialPosition = this.getPosition(
      this.tileRendering.getColRow(e.clientX, e.clientY),
    );

    const emptyTilePosition = this.game.tiles.indexOf(0);
    const x = this.tileRendering.getRelativeX(e.clientX);
    const y = this.tileRendering.getRelativeY(e.clientY);

    if (this.tileRendering.clickOnEdge(x, y)) {
      this.audio.playSound('badClick');
      return;
    }
    if (this.animation.started || this.isWin) {
      this.audio.playSound('badClick');
      return;
    }
    const puzzleDiff = this.puzzleDifficulty;
    if (
      !(
        initialPosition === emptyTilePosition + puzzleDiff
                || initialPosition === emptyTilePosition - puzzleDiff
                // we can't move the left tile if emptyTile is in the first column
                || (initialPosition === emptyTilePosition - 1
                    && emptyTilePosition % puzzleDiff !== 0)
                // we can't move the right tile if it is in first column
                || (initialPosition === emptyTilePosition + 1
                    && initialPosition % puzzleDiff !== 0)
      )
    ) {
      this.audio.playSound('badClick');
      return;
    }

    this.animation.startX = e.clientX;
    this.animation.startY = e.clientY;
    this.animation.position = initialPosition;

    this.addCanvasEvents();
  }

  addCanvasEvents() {
    this.canvas.onmousemove = (event) => this.myMove(event);
    this.canvas.onmouseup = (event) => this.myUp(event);
    this.canvas.onmouseout = (event) => this.mouseOutsideField(event);
  }

  deleteCanvasEvents() {
    this.canvas.onmousemove = null;
    this.canvas.onmouseup = null;
    this.canvas.onmouseout = null;
  }

  checkIfWin() {
    if (this.game.isWin) {
      this.isWin = true;
      this.timer.stop();
      this.solutionIsShowing = false;
      this.canvas.onmousedown = (e) => this.myDown(e);
      this.gameHTML.disableSelect(false);

      this.tileRendering.winField(
        this.size,
        this.puzzleDifficulty,
        this.fieldSize,
        this.padding,
      );

      const time = this.timer.formatTime();

      this.gameHTML.showWinNotification(this.moveCounter, time);
      this.bestScores.addRecords({ moves: this.moveCounter, time });
    }
  }

  myUp(event) {
    if (!this.tileIsMoving(event)) {
      this.handleClick(event);
    } else if (this.animation.started) this.handleMove(event);
    this.deleteCanvasEvents();
  }

  mouseOutsideField(e) {
    this.deleteCanvasEvents();
    this.animateReturn(e);
  }

  showMenuHandler() {
    if (this.solutionIsShowing) return;
    this.timer.stop();
    this.gameHTML.hideOverlay(false);
  }

  resumeGameHandler(newTime) {
    this.timer.start(newTime);
    this.gameHTML.clearMenuNotification();
    this.gameHTML.hideOverlay(true);
  }

  showSolutionHandler() {
    if (this.solutionIsShowing) return;

    const moveHistory = this.game.getMoveHistory();
    if (moveHistory.length <= 1) return;

    this.solutionIsShowing = true;
    this.gameHTML.disableSelect(true);
    this.canvas.onmousedown = null;

    this.revertMoveRecursively(moveHistory, moveHistory.length - 2);
  }

  revertMoveRecursively(moveHistory, number) {
    const prevArray = moveHistory[number];
    const prevMovePosition = prevArray.indexOf(0);
    const tile = {
      row: Math.floor(prevMovePosition / this.puzzleDifficulty),
      col: prevMovePosition % this.puzzleDifficulty,
    };

    this.animation.position = prevMovePosition;
    this.animation.started = true;

    const emptyTile = this.game.getEmptyTileLocation();
    const moveCoords = this.calcMoveCoords(emptyTile, tile);

    createAnimation(
      moveCoords.from,
      moveCoords.to,
      constants.ANIMATION_SETTINGS.solveDuration,
      (pos) => this.renderAnimationFrame(pos),
      () => {
        this.doTurnToDir(moveCoords.direction);
        setTimeout(() => {
          if (number > 0) {
            this.revertMoveRecursively(moveHistory, number - 1);
          }
        }, constants.ANIMATION_SETTINGS.solveDuration);
      },
    );
  }

  resizeField() {
    if (
      (window.screen.width > constants.MOBILE_SCREEN && this.isLarge)
            || (window.screen.width <= constants.MOBILE_SCREEN && !this.isLarge)
    ) {
      return;
    }

    if (window.screen.width > constants.MOBILE_SCREEN && !this.isLarge) {
      this.fieldSize = constants.FIELD_SIZE_LARGE;
      this.padding = constants.PADDING_LARGE;
      this.isLarge = true;
    } else {
      this.padding = constants.PADDING_SMALL;
      this.fieldSize = constants.FIELD_SIZE_SMALL;
      this.isLarge = false;
    }
    this.calculateSize();

    if (this.isWin) {
      this.tileRendering.winField(
        this.size,
        this.puzzleDifficulty,
        this.fieldSize,
        this.padding,
      );

      return;
    }

    this.tileRendering.init(
      this.size,
      this.puzzleDifficulty,
      this.game.tiles,
      this.padding,
      true,
    );
  }
}

document.body.onload = function load() {
  const gemPuzzle = new GemPuzzle(constants.DEFAULT_FIELD_SIZE, new LocalStorage());
  gemPuzzle.start();
};
