// source: https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript
const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
// eslint-disable-next-line
const comparer = (idx, asc) => (a, b) => ((v1, v2) => (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)
  ? v1 - v2
  : v1.toString().localeCompare(v2)))(
  getCellValue(asc ? a : b, idx),
  getCellValue(asc ? b : a, idx),
);

export { comparer as default };
