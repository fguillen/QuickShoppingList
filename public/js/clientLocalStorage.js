/* eslint-disable no-console */
/* eslint-disable no-undef */
window.clientLocalStorage = (function () {
  function getElements() {
    return JSON.parse(localStorage.getItem('elements')) || [];
  }

  function createElement(element) {
    const elements = getElements().concat(element);
    localStorage.setItem('elements', JSON.stringify(elements));
  }

  function updateElement(attrs) {
    const elements =
      getElements().map((element) => {
        if(element.id === attrs.id) {
          return Object.assign({}, element, attrs);
        } else {
          return element;
        }
      });

    localStorage.setItem('elements', JSON.stringify(elements));
  };

  function deleteElement(attrs) {
    const elements =
      getElements().filter((element) => {
        return element.id !== attrs.id
      });

    localStorage.setItem('elements', JSON.stringify(elements));
  }

  return {
    getElements,
    createElement,
    updateElement,
    deleteElement,
  };
}());
