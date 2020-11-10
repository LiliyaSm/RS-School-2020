export default class Timer {
  constructor(time) {
    this.time = time;
    this.totalSeconds = -1;
    this.myInterval = null;
  }

  start(newTime) {
    if (newTime) {
      this.totalSeconds = newTime;
    }

    this.showTime();
    this.myInterval = setInterval(() => this.showTime(), 1000);
  }

  formatTime() {
    const sec = this.totalSeconds % 3600 % 60;
    const min = parseInt(this.totalSeconds % 3600 / 60);
    const hour = parseInt(this.totalSeconds / 3600);
    function addZero(n) {
      return (parseInt(n, 10) < 10 ? '0' : '') + n;
    }
    // Output Time
    return `${hour}:${addZero(min)}:${addZero(
      sec,
    )}`;
  }

  showTime() {
    ++this.totalSeconds;
    this.time.innerHTML = this.formatTime();
  }

  resetTimer() {
    clearInterval(this.myInterval);
    this.totalSeconds = -1;
    this.showTime();
    this.myInterval = setInterval(() => this.showTime(), 1000);
  }

  pauseTimer() {
    clearInterval(this.myInterval);
  }

  stop() {
    clearInterval(this.myInterval);
  }

  getSeconds() {
    // already was increased
    return this.totalSeconds - 1;
  }
}
