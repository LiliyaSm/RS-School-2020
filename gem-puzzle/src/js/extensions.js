function arraysEqual(a, b) {
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function deleteRepeatingElements(arr) {
  for (let i = 1; i <= arr.length - 1; i++) {
    const prevArray = arr[arr.length - i];
    for (let j = 0; j < arr.length - i; j++) {
      // we look before reaching the checked array
      if (arraysEqual(prevArray, arr[j])) {
        // delete unnecessary moveHistory
        const end = arr.length - i + 1;
        const begin = j + 1;
        arr.splice(begin, end - begin);
        break;
      }
    }
  }
  return arr;
}

// eslint-disable-next-line import/prefer-default-export
export { arraysEqual, deleteRepeatingElements };
