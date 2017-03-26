/* eslint-disable no-console */
/* eslint-disable no-undef */
window.clientLocalStorage = (function () {
  function getLists() {
    let raw_content = localStorage.getItem('quick_shopping_list');
    // console.log('clientLocalStorage.getLists()', raw_content);
    let db = JSON.parse(raw_content);
    return db ? db.lists : [];
  }

  function getList(lists, listId) {
    return lists.find(function(list) { return list.id === listId });
  }

  function createList(list) {
    console.log("clientLocalStorage.createList()", list);

    let lists = this.getLists();
    lists = lists.concat(list);

    localStorage.setItem('quick_shopping_list', JSON.stringify({ "lists": lists }));
  }

  function createElement(element, listId) {
    let lists = this.getLists();
    let list = this.getList(lists, listId);

    list.elements = list.elements.concat(element);

    localStorage.setItem('quick_shopping_list', JSON.stringify({ "lists": lists }));
  }

  function updateElement(attrs, listId) {
    let lists = this.getLists();
    let list = this.getList(lists, listId);

    list.elements =
      list.elements.map((element) => {
        if(element.id === attrs.id) {
          return Object.assign({}, element, attrs);
        } else {
          return element;
        }
      });

    localStorage.setItem('quick_shopping_list', JSON.stringify({ "lists": lists }));
  };

  function deleteElement(attrs, listId) {
    let lists = this.getLists();
    let list = this.getList(lists, listId);

    list.elements =
      list.elements.filter((element) => {
        return element.id !== attrs.id
      });

    localStorage.setItem('quick_shopping_list', JSON.stringify({ "lists": lists }));
  }

  return {
    getLists,
    getList,
    createList,
    createElement,
    updateElement,
    deleteElement,
  };
}());
