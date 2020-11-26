export default class LocalStorage {
  static set(name, value) {
    window.localStorage.setItem(name, JSON.stringify(value));
  }

  static get(name, subst = null) {
    return JSON.parse(window.localStorage.getItem(name) || subst);
  }

  static del(name) {
    localStorage.removeItem(name);
  }
}
