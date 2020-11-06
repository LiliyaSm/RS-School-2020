export default class Timer {
    constructor(time) {
        this.time = time;
        this.totalSeconds = 0;
        this.myInterval = null;
    }

    start() {
        this.showTime();
        this.myInterval = setInterval(() => this.showTime(), 1000);
    }

    showTime() {
        const sec = this.totalSeconds % 60;
        const min = parseInt(this.totalSeconds / 60);
        const hour = parseInt(this.totalSeconds / 3600);

        // Output Time
        this.time.innerHTML = `${hour}<span>:</span>${addZero(
            min
        )}<span>:</span>${addZero(sec)}`;

        ++this.totalSeconds;

        function addZero(n) {
            return (parseInt(n, 10) < 10 ? "0" : "") + n;
        }
    }

    resetTimer() {
        clearInterval(this.myInterval);
        this.totalSeconds = 0;
        this.showTime();
        this.myInterval = setInterval(() => this.showTime(), 1000);
    }

    pauseTimer() {
        clearInterval(this.myInterval);
    }

    stop() {
        clearInterval(this.myInterval);
    }
}
