export default class LocalStorage {
  set(name, value) {
    window.localStorage.setItem(name, JSON.stringify(value));
  }

  get(name, subst = null) {
    return JSON.parse(window.localStorage.getItem(name) || subst);
  }

  del(name) {
    localStorage.removeItem(name);
  }
}
