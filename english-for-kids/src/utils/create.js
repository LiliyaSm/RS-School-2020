export default function create(el, classNames, parent, ...dataAttr) {
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
    return element;
}
