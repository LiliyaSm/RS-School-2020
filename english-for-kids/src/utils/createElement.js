export default function createElement(
    el,
    classNames,
    parent,
    dataAttr,
    eventListeners
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

    if (dataAttr) {
        dataAttr.forEach(([attrName, attrValue]) => {
            element.setAttribute(attrName, attrValue);
        });
    }

    if (eventListeners) {
        eventListeners.forEach(([event, fn]) => {
            element.addEventListener(event, fn);
        });
    }

    console.log(event);

    return {
        element: element,
        unsubscribe: (event, fn) => {
            element.removeEventListener(event, fn);
        },
    };
}

/*

let clickHandler = ();
eventListeners = [["onClick", clickHandler]];

var menu = createElement(...eventListeners);

{
    element: {},
    unsubscribe: fn(event, fn);
}


menu.unsubscribe("onClick", clickHandler);
*/
