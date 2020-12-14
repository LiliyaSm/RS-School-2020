// source: https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript
const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
const comparer = (idx, ascOrder) => (a, b) => {
  // eslint-disable-next-line
  const isNumber = (v1, v2) => v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2);
  const valueA = getCellValue(ascOrder ? a : b, idx);
  const valueB = getCellValue(ascOrder ? b : a, idx);
  return isNumber(valueA, valueB)
    ? valueA - valueB
    : valueA.toString().localeCompare(valueB);
};

export { comparer as default };
