(() => {
    const firstElement = document.querySelectorAll("[nav-selectable]")[0];
    firstElement.setAttribute("nav-selected", "true");
    firstElement.setAttribute("nav-index", "0");
    firstElement.focus();
})();

const getAllElements = () => document.querySelectorAll("[nav-selectable]");

const getTheIndexOfTheSelectedElement = () => {
    const element = document.querySelector("[nav-selected=true]");
    return element ? parseInt(element.getAttribute("nav-index"), 10) : 0;
};

const selectElement = selectElement =>
    [].forEach.call(getAllElements(), (element, index) => {
        const selectThisElement = element === selectElement;
        element.setAttribute("nav-selected", selectThisElement);
        element.setAttribute("nav-index", index);
        if (element.nodeName === 'INPUT') {
            selectThisElement ? element.focus() : element.blur();
        }
    });

const Down = event => {
    const allElements = getAllElements();
    const currentIndex = getTheIndexOfTheSelectedElement();
    const goToFirstElement = currentIndex + 1 > allElements.length - 1;
    const setIndex = goToFirstElement ? 0 : currentIndex + 1;
    selectElement(allElements[setIndex] || allElements[0]);
    setSoftkey(setIndex);
};

const Up = event => {
    const allElements = getAllElements();
    const currentIndex = getTheIndexOfTheSelectedElement();
    const goToLastElement = currentIndex === 0;
    const setIndex = goToLastElement ? allElements.length - 1 : currentIndex - 1;
    selectElement(allElements[setIndex] || allElements[0]);
    setSoftkey(setIndex);
};

const setSoftkey = setIndex =>
    setLabels({
        center: setIndex === 0 ? "Insert" : "Toggle",
        right: setIndex === 0 ? "" : "Delete"
    });

const getCurrentElement = () => document.querySelector("[nav-selected=true]");

const Enter = event => {
    const currentElement = getCurrentElement();
    currentElement.tagName === "INPUT"
        ? addToDo(currentElement)
        : toggleToDo(currentElement);
};

const SoftRight = event => {
    const currentElement = getCurrentElement();
    if (currentElement.tagName === "INPUT") return;

    const currentIndex = parseInt(currentElement.getAttribute("nav-index"), 10);
    const allElementsSelectable = document.querySelectorAll("[nav-selectable]");
    const selectEle = allElementsSelectable[currentIndex - 1];
    selectElement(selectEle);

    if (currentIndex - 1 === 0) setLabels({ center: "Insert" });
    currentElement.remove();
};

const setLabels = ({ left, center, right }) => {
    document.getElementById("left").innerText = left ? left : "";
    document.getElementById("center").innerText = center ? center : "";
    document.getElementById("right").innerText = right ? right : "";
};

const addToDo = currentElement => {
    if (!currentElement.value.length) return;
    const toDos = document.getElementById("toDos");
    const node = document.createElement("SPAN");
    const text = document.createTextNode(currentElement.value);
    node.setAttribute("nav-selectable", "true");
    node.appendChild(text);
    toDos.appendChild(node);
    currentElement.value = "";
};

const toggleToDo = currentElement =>
    currentElement.classList.toggle("completed");

document.addEventListener("keydown", event => {
    switch (event.key) {
        case "Enter":
            return Enter(event);
        case "ArrowDown":
            return Down(event);
        case "ArrowUp":
            return Up(event);
        case "SoftRight":
            return SoftRight(event);
        default:
            return;
    }
});