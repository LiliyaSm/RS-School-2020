export default class LocalStorage {
    constructor(name) {
        this.name = name ;       
    }

    set( value) {
        window.localStorage.setItem(this.name, JSON.stringify(value));
    }

    get(subst = null) {
        return JSON.parse(window.localStorage.getItem(this.name) || subst);
    }

    del() {
        localStorage.removeItem(this.name);
    }
}
