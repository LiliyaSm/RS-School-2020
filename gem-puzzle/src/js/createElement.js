export default function createElement(
  el,
  classNames,
  parent,
  eventListeners,
  ...dataAttr
) {
  // element, classes comma separated, parent, dataAttr
  let element = null;
  try {
    element = document.createElement(el);
  } catch (error) {
    throw new Error(`Unable to create HTMLElement with ${el} tag name`);
  }

  if (classNames) element.classList.add(...classNames);

  if (parent) {
    parent.appendChild(element);
  }

  if (dataAttr.length) {
    dataAttr.forEach(([attrName, attrValue]) => {
      element.setAttribute(attrName, attrValue);
    });
  }

  if (eventListeners) {
    eventListeners.forEach(([event, fn]) => {
      element.addEventListener(event, fn);
    });
  }

  return {
    element,
    unsubscribe: (event, fn) => {
      element.removeEventListener(event, fn);
    },
  };
}
