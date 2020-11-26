export default class EventObserver {
    constructor() {
        this.observers = {};
    }

    subscribe(type, fn) {
        if(!this.observers[type]) this.observers[type] = [];
        this.observers[type].push(fn);
    }

    unsubscribe(type, fn) {
        this.observers[type] = this.observers[type].filter(
            (subscriber) => subscriber !== fn
        );
    }

    broadcast(type, data) {
        this.observers[type].forEach((subscriber) => subscriber(data));
    }
}
