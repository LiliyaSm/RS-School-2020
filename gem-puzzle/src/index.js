import create from './utils/create'; // creates DOM elements
import CreateField from './utils/createField'; // creates canvas field
import Timer from './utils/timer'; // creates canvas field
import Audio from './utils/audio'; // sounds
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as storage from './utils/storage';

const DRAG_SENSITIVITY = 6;

const DirectionEnum = {
  UP: 1,
  RIGHT: 2,
  DOWN: 3,
  LEFT: 4,
};

const tableHeader = ["moves","time", "date", ];

function arraysEqual(a, b) {
  // check if arrays are equal
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

class Game {
  constructor(PUZZLE_DIFFICULTY) {
    this.PUZZLE_DIFFICULTY = Number(PUZZLE_DIFFICULTY);
    this.winMap = this.createWinMap();
    this.moveHistory = [[...this.winMap]];

    // info to shuffle the array
    this.minShuffle = 5;
    this.maxShuffle = 10;
    this.shuffleArray = this.shuffleTiles();

    // this.context = null;
    this.canvas = null;
    this.rect = null; // abs. size of element

    this.moveCounter = 0;

    this.timer = null;

    this.isWin = false;

    this.isLarge = true;

    this.fieldSize = 500;
    this.SIZE = this.fieldSize / this.PUZZLE_DIFFICULTY;

    this.drag = {
      started: false,
      position: null,
      startX: 0,
      startY: 0,
      x: 0,
      y: 0,
    };

    this.overlay = null;

    this.animation = {
      // Frames per second
      frameRate: 100,
      normDuration: 100,
      solveDuration: 70,
    };
  }

  createHTML() {
    this.body = document.querySelector('body');
    this.body.setAttribute('class', 'container-fluid');

    const header = create('header', null, this.body);

    this.winContainer = create('div', ['winContainer'], this.body);
    const thirdRow = create('div', ['row'], this.body);
    const footer = create('footer', null, this.body);

    const menu = create('button', ['menuBtn'], header);
    this.counterContainer = create('div', null, header);
    this.timeContainer = create('div', null, header);

    const headerTime = create('h1', ['headerTime'], this.timeContainer);
    this.time = create('time', ['time'], this.timeContainer);

    const quickStart = create('button', ['quickStart'], footer);
    const select = create('select', ['select'], footer);
    const solution = create('button', ['solution'], footer);

    const headerMoves = create(
      'h1',
      ['headerMoves'],
      this.counterContainer,
    );

    this.counter = create('span', ['counter'], this.counterContainer);

    this.counter.textContent = 0;

    thirdRow.appendChild(this.canvas);

    this.overlay = create('div', ['overlay', 'hide'], this.body);
    this.menu__container = create('div', ['menu__container'], this.overlay);
    this.bestScoresContainer = create(
      'div',
      ['bestScoresContainer', 'hide'],
      this.overlay,
    );

    this.table = create(
      'table',
      ['bestScoresContainer'],
      this.bestScoresContainer,
    );
    const tr = create('tr', null, this.table);

    this.back = create('button', null, this.bestScoresContainer);

    const beginAgain = create('button', null, this.menu__container);
    this.saveGame = create('button', null, this.menu__container);
    this.loadGame = create('button', null, this.menu__container);
    this.sound = create('button', null, this.menu__container);

    this.bestScore = create('button', null, this.menu__container);
    this.btn1 = create('button', null, this.menu__container);

    this.btn1.textContent = 'Resume game';
    this.sound.textContent = 'Sound: On';
    this.bestScore.textContent = '10 best scores';
    this.saveGame.textContent = 'Save Game';
    this.loadGame.textContent = 'Load Game';
    this.back.textContent = 'Back';
    headerMoves.textContent = 'moves';
    headerTime.textContent = 'time';

    this.btn1.addEventListener('click', () => this.resumeGame());
    this.bestScore.addEventListener('click', () => this.showBestScores());
    this.saveGame.addEventListener('click', (e) => this.saveGameHandler(e));
    this.loadGame.addEventListener('click', (e) => this.loadGameHandler(e));
    this.back.addEventListener('click', (e) => this.returnMenu(e));
    this.sound.addEventListener('click', (e) => {
      this.audio.toggleSound(e);
      this.sound.innerHTML = this.sound.innerHTML === 'Sound: Off'
        ? 'Sound: On'
        : 'Sound: Off';
    });

    select.addEventListener('change', (e) => this.logValue(e));

    const option1 = create(
      'option',
      null,
      select,
      ['selected', ''],
      ['selected', 'selected'],
      ['disabled', 'disabled'],
      ['hidden', 'hidden'],
    );

    option1.textContent = 'Change field size ';
    for (let i = 3; i <= 8; i++) {
      const option = create('option', null, select, ['value', i]);
      option.textContent = `${i}x${i}`;
    }
    beginAgain.innerHTML = 'New Game';
    solution.innerHTML = 'Solve';
    menu.innerHTML = 'menu';
    quickStart.innerHTML = 'New Game';

    beginAgain.addEventListener('click', () => {
      this.resumeGame();
      this.restart();
    });

    quickStart.addEventListener('click', () => {
      this.restart();
    });

    solution.addEventListener('click', () => {
      this.showSolution();
    });

    menu.addEventListener('click', (e) => this.showMenu(e));

    tableHeader.forEach((name) => {
      const th = create('th', null, tr);
      th.textContent = name;
    });
    // notification text
    this.text = create('span', ['text'], this.menu__container);
  }

  start() {
    this.tileRendering = new CreateField();
    this.canvas = this.tileRendering.canvas;

    this.createHTML();
    this.audio = new Audio(this.body);
    this.audio.init();
    this.tileRendering.init(
      this.SIZE,
      this.PUZZLE_DIFFICULTY,
      this.shuffleArray,
    );

    this.timer = new Timer(this.time);
    this.timer.start();

    this.resizeField();

    // abs. size of element. After loading ALL DOM elements!
    this.rect = this.canvas.getBoundingClientRect();
  }

  restart(saveImage) {
    if (this.isWin) {
      this.winContainer.textContent = '';
      this.isWin = false;
    }
    this.winMap = this.createWinMap();
    this.moveHistory = [[...this.winMap]];

    this.shuffleArray = this.shuffleTiles();
    this.tileRendering.init(
      this.SIZE,
      this.PUZZLE_DIFFICULTY,
      this.shuffleArray,
      saveImage,
    );
    this.canvas = this.tileRendering.canvas;
    this.rect = this.canvas.getBoundingClientRect(); // abs. size of element

    this.resetCounter();

    this.timer.resetTimer();
  }

  saveGameHandler() {
      if (this.isWin) {
        this.addAnimation("Can't be save!");
        return;
      };
    
    this.addAnimation('Game saved!');
    storage.set('15gameObject', {
      shuffleArray: this.shuffleArray,
      timer: this.timer.getSeconds(),
      counter: this.moveCounter,
      PUZZLE_DIFFICULTY: this.PUZZLE_DIFFICULTY,
      imageNumber: this.tileRendering.getImage(),
      solution: this.moveHistory,
    });
  }

  loadGameHandler() {
    
    const savedGameObject = storage.get('15gameObject');
    this.shuffleArray = savedGameObject.shuffleArray;
    this.moveHistory = savedGameObject.solution;
    this.PUZZLE_DIFFICULTY = savedGameObject.PUZZLE_DIFFICULTY;
    this.SIZE = this.fieldSize / this.PUZZLE_DIFFICULTY;

    this.tileRendering.setImage(savedGameObject.imageNumber);

    this.tileRendering.init(
      this.SIZE,
      this.PUZZLE_DIFFICULTY,
      this.shuffleArray,
      true,
    );

    this.moveCounter = savedGameObject.counter;
    this.counter.textContent = this.moveCounter;

    this.resumeGame(savedGameObject.timer);

    this.canvas = this.tileRendering.canvas;
    this.rect = this.canvas.getBoundingClientRect(); // abs. size of element
  }

  logValue(e) {
    this.PUZZLE_DIFFICULTY = Number(e.target.value);
    this.SIZE = this.fieldSize / this.PUZZLE_DIFFICULTY;
    this.restart(true);
  }

  increaseCounter() {
    ++this.moveCounter;
    this.counter.textContent = this.moveCounter;
  }

  resetCounter() {
    this.moveCounter = 0;
    this.counter.textContent = this.moveCounter;
  }

  createWinMap() {
    //  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    const arraySize = this.PUZZLE_DIFFICULTY * this.PUZZLE_DIFFICULTY;
    const result = [...Array(arraySize + 1).keys()].slice(1);
    result[arraySize - 1] = 0;
    return result;
  }

  shuffleTiles() {
    this.shuffleArray = [...this.winMap];
    const maxShuffle = this.maxShuffle * this.PUZZLE_DIFFICULTY * this.PUZZLE_DIFFICULTY;
    const minShuffle = this.minShuffle * this.PUZZLE_DIFFICULTY * this.PUZZLE_DIFFICULTY;
    const shifts = ['left', 'right', 'up', 'down'];
    const rand = Math.floor(
      Math.random()
            * (maxShuffle
                - minShuffle)
            + minShuffle,
    ); // get a random number of shuffles

    // repeat rand times
    let prevOperation;
    for (let i = 0; i <= rand; i++) {
      // get random number between 0 and 3
      const randOperation = Math.floor(Math.random() * shifts.length);

      const operation = shifts[randOperation];

      if (prevOperation) {
        if ((operation === 'right' && prevOperation === 'left')
        || (operation === 'left' && prevOperation === 'right')
        || (operation === 'up' && prevOperation === 'down')
        || (operation === 'down' && prevOperation === 'up')) {
          continue;
        }
      }

      const emptyTilePosition = this.shuffleArray.indexOf(0);

      const row = Math.floor(emptyTilePosition / this.PUZZLE_DIFFICULTY);
      const col = emptyTilePosition % this.PUZZLE_DIFFICULTY;
      switch (operation) {
      case 'left':
        if (col === 0) {
          continue;
        }
        this.moveToDir(DirectionEnum.LEFT);
        break;

      case 'right':
        if (col === this.PUZZLE_DIFFICULTY - 1) {
          continue;
        }
        this.moveToDir(DirectionEnum.RIGHT);
        break;
      case 'up':
        if (row === 0) {
          continue;
        }
        this.moveToDir(DirectionEnum.UP);
        break;
      case 'down':
        if (row === this.PUZZLE_DIFFICULTY - 1) {
          continue;
        }
        this.moveToDir(DirectionEnum.DOWN);
        break;

      default:
        throw new Error('Unexpected value');
      }

      prevOperation = operation;
    }
    return this.shuffleArray;
  }

  getColRow(clientX, clientY) {
    const x = clientX - this.rect.left;
    const y = clientY - this.rect.top;
    return {
      col: Math.floor(x / this.SIZE),
      row: Math.floor(y / this.SIZE),
    };
  }

  getPosition(pos) {
    // mouse position subtracted from the parent element's offset position, mouse position you are
    // getting is relative to the client window

    return pos.row * this.PUZZLE_DIFFICULTY + pos.col;
  }

  handleClick(e, prevCol, prevRow) {
    let col;
    let row;
    let duration;
    // was called with these parameters
    if (typeof prevRow !== 'undefined' && typeof prevCol !== 'undefined') {
      col = prevCol;
      row = prevRow;
      duration = this.animation.solveDuration;
    } else {
      ({ col, row } = this.getColRow(e.clientX, e.clientY));
      duration = this.animation.normDuration;
    }

    // this.animation.position = this.getPosition({ col: col, row: row });
    this.drag.started = true;

    const emptyTilePosition = this.shuffleArray.indexOf(0);
    const rowEmptyTile = Math.floor(
      emptyTilePosition / this.PUZZLE_DIFFICULTY,
    );
    const colEmptyTile = emptyTilePosition % this.PUZZLE_DIFFICULTY;

    if (
      col === colEmptyTile
          && (rowEmptyTile + 1 === row || rowEmptyTile - 1 === row)
    ) {
      // shift in column

      if (rowEmptyTile + 1 === row) {
        this.createAnimation(
          { from: col * this.SIZE, to: col * this.SIZE },
          { from: row * this.SIZE, to: row * this.SIZE - this.SIZE },
          duration,
          // call to change array only after animation
          () => this.doTurnToDir(DirectionEnum.DOWN),
        );
      } else {
        this.createAnimation(
          { from: col * this.SIZE, to: col * this.SIZE },
          { from: row * this.SIZE, to: row * this.SIZE + this.SIZE },
          duration,
          // call to change array only after animation
          () => this.doTurnToDir(DirectionEnum.UP),
        );
      }
    } else if (
      row === rowEmptyTile
          && (colEmptyTile + 1 === col || colEmptyTile - 1 === col)
    ) {
      // shift in row

      if (colEmptyTile + 1 === col) {
        // сдвиг вправо пустой!!!!

        this.createAnimation(
          { from: col * this.SIZE, to: col * this.SIZE - this.SIZE },
          { from: row * this.SIZE, to: row * this.SIZE },
          duration,
          // call to change array only after animation
          () => this.doTurnToDir(DirectionEnum.RIGHT),
        );
      } else {
        this.createAnimation(
          { from: col * this.SIZE, to: col * this.SIZE + this.SIZE },
          { from: row * this.SIZE, to: row * this.SIZE },
          duration,
          // call to change array only after animation
          () => this.doTurnToDir(DirectionEnum.LEFT),
        );
      }
    }
  }

  createAnimation(x, y, duration, callback) {
    let currFrame = 0;
    // Calculate total frames for current animation based on frameRate
    const totalFrames = (duration * this.animation.frameRate) / 1000;

    // this func is recursively called to draw each frame
    const drawFrame = () => {
      // calculate new currPos
      const currPosX = x.from + ((x.to - x.from) * currFrame) / totalFrames;
      const currPosY = y.from + ((y.to - y.from) * currFrame) / totalFrames;
      // call render function to update the screen
      this.tileRendering.createTiles(
        this.shuffleArray,
        this.drag.started,
        this.drag.position,
        currPosX,
        currPosY,
      );

      // increment current frame number
      currFrame += 1;
      // check if we not exceed totalFrame - set a timeout to call drawFrame
      // after the desired delay
      if (currFrame <= totalFrames) {
        setTimeout(drawFrame, duration / totalFrames);
      } else {
        this.drag.started = false;
        if (callback) callback();
      }
    };
    // call drawFrame to start animation (draw the first frame)
    drawFrame();
  }

  handleMove(e) {
    const { col, row } = this.getColRow(e.clientX, e.clientY);

    const position = this.getPosition({ col, row });

    const emptyTilePosition = this.shuffleArray.indexOf(0);
    if (this.drag.started && position === emptyTilePosition) {
      this.createAnimation(
        {
          from: e.clientX - this.rect.left - this.SIZE / 2,
          to: col * this.SIZE,
        },
        {
          from: e.clientY - this.rect.top - this.SIZE / 2,
          to: row * this.SIZE,
        },
        300,
        () => this.doTurnToPos(this.drag.position),
      );
    } else {
      this.animateReturn(e);
    }

    // this.tileRendering.createTiles(this.shuffleArray);
  }

  animateReturn(e) {
    const { col: initialCol, row: initialRow } = this.getColRow(
      this.drag.startX,
      this.drag.startY,
    );
    this.createAnimation(
      {
        from: e.clientX - this.rect.left - this.SIZE / 2,
        to: initialCol * this.SIZE,
      },
      {
        from: e.clientY - this.rect.top - this.SIZE / 2,
        to: initialRow * this.SIZE,
      },
      400,
      () => {
        this.drag.started = false;
        this.drag.x = 0;
        this.drag.y = 0;
        this.drag.position = null;
        this.audio.playSound('badClick');
      },
    );
  }

  moveToDir(direction) {
    // use for shuffling
    // just get targetMove
    const emptyTilePosition = this.shuffleArray.indexOf(0);
    const targetMove = this.useDirection(emptyTilePosition, direction);
    this.moveToPos(targetMove);
  }

  moveToPos(tilePos) {
    const emptyTilePosition = this.shuffleArray.indexOf(0);
    this.shuffleArray[emptyTilePosition] = this.shuffleArray[tilePos];
    this.shuffleArray[tilePos] = 0;
    this.moveHistory.push([...this.shuffleArray]);
    // console.log(this.moveHistory);
  }

  useDirection(tile, direction) {
    switch (direction) {
    case DirectionEnum.RIGHT:
      return tile + 1;
    case DirectionEnum.LEFT:
      return tile - 1;
    case DirectionEnum.UP:
      return tile - this.PUZZLE_DIFFICULTY;
    case DirectionEnum.DOWN:
      return tile + this.PUZZLE_DIFFICULTY;
    default:
      throw new Error('Unexpected value');
    }
  }

  doTurnToDir(direction) {
    // player turn
    const emptyTilePosition = this.shuffleArray.indexOf(0);
    const targetPos = this.useDirection(emptyTilePosition, direction);
    this.doTurnToPos(targetPos);
  }

  doTurnToPos(pos) {
    // player turn
    this.moveToPos(pos);
    this.increaseCounter();
    this.audio.playSound('click');
    this.checkIfWin();
  }

  myMove(e) {
    // prevent dragging tile without sensible mouse moving
    const diffX = Math.abs(e.pageX - this.drag.startX);
    const diffY = Math.abs(e.pageY - this.drag.startY);

    if (diffX > DRAG_SENSITIVITY || diffY > DRAG_SENSITIVITY) {
      this.drag.started = true;
      this.drag.x = e.pageX - this.rect.left;
      this.drag.y = e.pageY - this.rect.top;

      this.tileRendering.createTiles(
        this.shuffleArray,
        this.drag.started,
        this.drag.position,
        // shift for centering on cursor
        this.drag.x - this.SIZE / 2,
        this.drag.y - this.SIZE / 2,
      );
    }
  }

  myDown(e) {
    // initial place of potential moving

    const rect = this.canvas.getBoundingClientRect(); // abs. size of element
    this.rect = rect;

    const position = this.getPosition(this.getColRow(e.clientX, e.clientY));

    const emptyTilePosition = this.shuffleArray.indexOf(0);

    const x = e.clientX - this.rect.left;
    const y = e.clientY - this.rect.top;

    // prevent - clicking on edge of field causes a bug
    if (
      x < 5
            || x > this.rect.width - 5
            || y < 5
            || y > this.rect.height - 5
    ) {
      console.log('prevent!');
      this.audio.playSound('badClick');
      return;
    }
    if (this.drag.started || this.isWin) {
      // check if shifting is available
      this.audio.playSound('badClick');
      return;
    }

    if (
      !(
        position === emptyTilePosition + this.PUZZLE_DIFFICULTY
                || position === emptyTilePosition - this.PUZZLE_DIFFICULTY
                || position === emptyTilePosition - 1
                || position === emptyTilePosition + 1
      )
    ) {
      this.audio.playSound('badClick');
      return;
    }
    console.log(position);
    this.drag.startX = e.pageX;
    this.drag.startY = e.pageY;

    this.drag.x = e.clientX - rect.left;
    this.drag.y = e.clientY - rect.top;
    this.drag.position = position;

    this.canvas.onmousemove = (event) => this.myMove(event);
    this.canvas.onmouseup = (event) => this.myUp(event);
    this.canvas.onmouseout = (event) => this.myOut(event);
  }

  checkIfWin() {
    if (arraysEqual(this.winMap, this.shuffleArray)) {
      this.isWin = true;
      this.timer.stop();
      this.tileRendering.winField(
        this.SIZE,
        this.PUZZLE_DIFFICULTY,
        this.fieldSize,
      );

      const time = this.timer.formatTime();

      this.timer.getSeconds();
      this.winContainer.innerHTML = `Ура! Вы решили головоломку за ${time} и ${this.moveCounter} ходов`;

      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const dayMonth = today.getDate();
      const hour = today.getHours();
      const min = today.getMinutes();
      const sec = today.getSeconds();

      let currScores = storage.get(
        `topScoresFor${this.PUZZLE_DIFFICULTY}`,
      );

      const newRecord = {
        date: `${dayMonth}.${month}.${year}`,
        moves: this.moveCounter,
        time,
      };
      // no records yet
      if (!currScores) {
        currScores = [];
        currScores.push(newRecord);
      } else {
        let inserted = false;
        for (let index = 0; index < currScores.length; index++) {
          if (this.moveCounter <= currScores[index].moves) {
            currScores.splice(index, 0, newRecord);
            inserted = true;
            break;
          }
        }
        if (!inserted) {
          currScores.push(newRecord);
        }
      }
      // take only first 10 results
      if (currScores.length > 10) {
        currScores = currScores.slice(0, 10);
      }

      storage.set(`topScoresFor${this.PUZZLE_DIFFICULTY}`, currScores);

      console.log('win');
    }
  }

  showBestScores() {
    this.menu__container.classList.add('hide');
    this.bestScoresContainer.classList.remove('hide');

    const bestScores = storage.get(`topScoresFor${this.PUZZLE_DIFFICULTY}`);

    // clear previous information

    while (this.table.rows.length > 1) {
      this.table.deleteRow(1);
    }
    if (!bestScores) {
      const div = create('div', ['temporary'], this.bestScoresContainer);
      this.bestScoresContainer.insertBefore(div, this.back);
      div.textContent = 'No records!';
    } else {
      bestScores.forEach((el) => {
        const tr = create('tr', null, this.table);
        tableHeader.forEach((name) => {
          const td = create('td', null, tr);
          td.innerHTML += `${el[name]} `;
        });
      });
    }
  }

  returnMenu(e) {
    this.menu__container.classList.remove('hide');
    e.target.parentNode.classList.add('hide');
    // delete all temporary notifications
    if (e.target.parentNode.querySelector('.temporary')) {
      e.target.parentNode.removeChild(
        e.target.parentNode.querySelector('.temporary'),
      );
    }
  }

  myUp(event) {
    // measure the difference between start and end drag
    const diffX = Math.abs(event.pageX - this.drag.startX);
    const diffY = Math.abs(event.pageY - this.drag.startY);

    if (diffX < DRAG_SENSITIVITY && diffY < DRAG_SENSITIVITY) {
      this.handleClick(event);
    } else if (this.drag.started) this.handleMove(event);

    // set to initial values
    // this.drag.started = false;
    // this.drag.position = null;
    this.drag.x = 0;
    this.drag.y = 0;
    this.canvas.onmousemove = null;
    this.canvas.onmouseup = null;
    this.canvas.onmouseout = null;
  }

  myOut(e) {
    // mouse outside the field
    this.canvas.onmousemove = null;
    this.canvas.onmouseup = null;
    this.canvas.onmouseout = null;
    this.animateReturn(e);
  }

  // logic for menu
  showMenu() {
    this.timer.stop();
    this.overlay.classList.remove('hide');
  }

  resumeGame(newTime) {
    // clear notification
    if (this.text.classList.contains('zoom')) {
      this.text.classList.remove('zoom');
    }
    this.text.textContent = '';

    this.timer.start(newTime);
    this.overlay.classList.add('hide');
  }

  showSolution() {
    document.addEventListener("click", this.disableClickOnPage);

    const moveHistory = this.deleteRepeatingMoves();

    for (let i = 2; i <= moveHistory.length; i++) {
      const prevArray = moveHistory[moveHistory.length - i];
      setTimeout(() => {
        const prevMovePosition = prevArray.indexOf(0);
        const prevRow = Math.floor(
          prevMovePosition / this.PUZZLE_DIFFICULTY,
        );
        const prevCol = prevMovePosition % this.PUZZLE_DIFFICULTY;
        this.drag.position = prevMovePosition;
        this.handleClick(null, prevCol, prevRow);
      }, i * 150);
    }
    document.removeEventListener("click", this.disableClickOnPage);
  }

  disableClickOnPage(e){
      e.stopPropagation();
      e.preventDefault();
  }

  deleteRepeatingMoves() {
    const moveHistory = [...this.moveHistory];
    for (let i = 1; i <= moveHistory.length - 1; i++) {
      // from the end
      const prevArray = moveHistory[moveHistory.length - i];
      for (let j = 0; j < moveHistory.length - i; j++) {
        // we look before reaching the checked array
        if (arraysEqual(prevArray, moveHistory[j])) {
          // delete unnecessary moveHistory
          const end = moveHistory.length - i + 1;
          const begin = j + 1;
          moveHistory.splice(begin, end - begin);
          console.log('shortcut!');
          break;
        }
      }
    }
    return moveHistory;
  }

  addAnimation(notificationText) {
    if (this.text.classList.contains('zoom')) {
      this.text.classList.remove('zoom');
    }

    // force browser to play animation again, set to null styles
    void this.text.offsetWidth;

    this.text.textContent = notificationText;
    this.text.classList.add('zoom');
  }

  resizeField() {
    if (
      (window.screen.width > 500 && this.isLarge)
            || (window.screen.width <= 500 && !this.isLarge)
    ) {
      return;
    }

    if (window.screen.width > 500 && !this.isLarge) {
      this.fieldSize = 500;
      this.isLarge = true;
    } else {
      this.fieldSize = 310;
      this.isLarge = false;
    }
    this.SIZE = this.fieldSize / this.PUZZLE_DIFFICULTY;

    if (this.isWin) {
      this.tileRendering.winField(
        this.SIZE,
        this.PUZZLE_DIFFICULTY,
        this.fieldSize,
      );

      return;
    }

    this.tileRendering.init(
      this.SIZE,
      this.PUZZLE_DIFFICULTY,
      this.shuffleArray,
      true,
    );
    // console.log(window.screen.width);
  }
}

document.body.onload = function load() {
  const game = new Game(4);
  game.start();

  game.canvas.addEventListener('mousedown', (e) => game.myDown(e));
  // game.canvas.onmousedown = game.myDown;

  window.addEventListener('resize', (e) => game.resizeField(e));
};
