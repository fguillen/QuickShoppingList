
class ShoppingList extends React.Component {
  state = {
    selectedFilter: 'all',
    selectedListId: null,
    listsSummary: [],
    elements: []
  };

  loadListsFromServer = () => {
    console.log('ShoppingList.loadListsFromServer()');
    let lists = clientLocalStorage.getLists();
    let selectedListId = lists[0] ? lists[0].id : null;
    let elements = lists[0] ? lists[0].elements : [];
    let listsSummary = lists.map( (list) => { return { "id": list.id, "name": list.name }; });

    console.log("ShoppingList.loadListsFromServer.listsSummary", listsSummary);

    this.setState(
      {
        selectedListId: selectedListId,
        elements: elements,
        listsSummary: listsSummary
      }
    );
  };

  updateElement = (attrs) => {
    console.log('ShoppingList.updateElement()', attrs);

    this.setState({
      elements: this.state.elements.map((element) => {
        if(element.id === attrs.id) {
          return Object.assign({}, element, attrs);
        } else {
          return element;
        }
      })
    });

    clientLocalStorage.updateElement(attrs, this.state.selectedListId);
  };

  updateSelectedFilter = (e) => {
    let selectedFilter = e.target.attributes.getNamedItem("data-value").value;
    console.log('ShoppingList.updateSelectedFilter', selectedFilter );

    this.setState({
      selectedFilter: selectedFilter
    });
  };

  updateSelectedList = (selectedListId) => {
    console.log('ShoppingList.updateSelectedList', selectedListId );
    let list = clientLocalStorage.getLists().find( (list) => { return list.id === selectedListId });

    this.setState({
      selectedListId: selectedListId,
      elements: list.elements,
    });
  };

  createElement = (attrs) => {
    console.log('ShoppingList.createElement()', attrs);

    const element = {
      id: uuid.v4(),
      title: attrs.title,
      state: 'toBuy',
    }

    this.setState({
      elements: this.state.elements.concat(element)
    });

    clientLocalStorage.createElement(element, this.state.selectedListId);
  };

  createList = (attrs) => {
    console.log('ShoppingList.createList()', attrs);

    const list = {
      id: uuid.v4(),
      name: attrs.name,
      elements: []
    }

    clientLocalStorage.createList(list);
    this.updateSelectedList(list.id)
  };

  deleteElement = (elementId) => {
    console.log('ShoppingList.deleteElement()', elementId);

    this.setState({
      elements: this.state.elements.filter((element) => {
        return element.id !== elementId
      })
    });

    clientLocalStorage.deleteElement({ id: elementId }, this.state.selectedListId);
  };

  filteredElements = () => {
    return this.filterElements(this.state.selectedFilter);
  };

  filterElements = (state) => {
    let result =
      this.state.elements.filter((element) => {
        return (element.state === state) || (state === 'all')
      });

    return result;
  };

  elementsCounters = () => {
    let result = {
      'all': this.filterElements('all').length,
      'toBuy': this.filterElements('toBuy').length,
      'bought': this.filterElements('bought').length,
      'onHold': this.filterElements('onHold').length
    }

    return result;
  }

  componentDidMount() {
    this.loadListsFromServer();
    // setInterval(this.loadListsFromServer, 5000);
  };

  render() {
    return (
      <div className='main ui container'>
        <ElementsFilter
          selectedFilter={this.state.selectedFilter}
          elementsCounters={this.elementsCounters()}
          updateSelectedFilter={this.updateSelectedFilter}
          updateSelectedList={this.updateSelectedList}
          listsSummary={this.state.listsSummary}
        />
        <Elements
          elements={this.filteredElements()}
          updateElement={this.updateElement}
          deleteElement={this.deleteElement}
        />
        <NewElement
          isOpen={true}
          createElement={this.createElement}
        />
        <NewListModal
          createList={this.createList}
        />
      </div>
    );
  }
}

class Elements extends React.Component {
  render() {
    const elements =
      this.props.elements.map((element) => (
        <EditableElement
          key={element.id}
          id={element.id}
          title={element.title}
          state={element.state}
          updateElement={this.props.updateElement}
          deleteElement={this.props.deleteElement}
        />
      ));

    return (
      <div className='ui three stackable cards'>
        {elements}
      </div>
    );
  }
}

class EditableElement extends React.Component {
  state = {
    editFormOpen: false
  };

  onEditButtonClick = () => {
    this.setState({ editFormOpen: true });
  };

  updateElement = (attrs) => {
    console.log('EditableElement.updateElement()');
    this.props.updateElement(attrs);
    this.setState({ editFormOpen: false });
  };

  closeForm = () => {
    console.log('EditableElement.closeForm()');
    this.setState({ editFormOpen: false });
  };

  render() {
    if (this.state.editFormOpen) {
      return (
        <ElementForm
          id={this.props.id}
          title={this.props.title}
          buttonText='Update'
          handleSubmit={this.updateElement}
          handleCancel={this.closeForm}
        />
      );
    } else {
      return (
        <Element
          id={this.props.id}
          title={this.props.title}
          state={this.props.state}
          onEditButtonClick={this.onEditButtonClick}
          deleteElement={this.props.deleteElement}
          updateElement={this.props.updateElement}
        />
      );
    }
  }
}

class ElementForm extends React.Component {
  state = {
    title: this.props.title || '',
  };

  handelTitleChange = (e) => {
    this.setState({ title: e.target.value });
  };

  handleSubmit = () => {
    console.log('ElamentForm.handleSubmit()');

    this.props.handleSubmit(
      {
        id: this.props.id,
        title: this.state.title
      }
    )
  };

  render() {
    return (
      <div className='ui centered card'>
        <div className='content'>
          <div className='ui form'>
            <div className='field'>
              <label>Name</label>
              <input
                type='text'
                value={this.state.title}
                onChange={this.handelTitleChange}
              />
            </div>
            <div className='ui two bottom attached buttons'>
              <button
                className='ui basic blue button'
                onClick={this.handleSubmit}
              >
                {this.props.buttonText}
              </button>

              <button
                className='ui basic red button'
                onClick={this.props.handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class NewElement extends React.Component {
  state = {
    isOpen: false,
  };

  handleFormOpen = () => {
    this.setState({ isOpen: true });
  };

  createElements = (attrs) => {
    console.log('NewElement.createElements()', attrs);

    const titles = attrs.title.split(",").map((title) => { return title.trim() });

    console.log('NewElement.createElements().titles', titles);

    titles.forEach((title) => {
      this.props.createElement({ title: title });
    });

    this.setState({ isOpen: false });
  };

  closeForm = () => {
    console.log('NewElement.closeForm()');
    this.setState({ isOpen: false });
  };

  render() {
    if (this.state.isOpen) {
      return (
        <ElementForm
          buttonText='Create'
          handleSubmit={this.createElements}
          handleCancel={this.closeForm}
        />
      );
    } else {
      return (
        <div className='ui basic content center aligned segment'>
          <button
            className='ui basic button icon'
            onClick={this.handleFormOpen}
          >
            <i className='plus icon' />
          </button>
        </div>
      );
    }
  }
}

class Element extends React.Component {
  deleteElement = () => {
    console.log('Element.deleteElement()', this.props.id);
    this.props.deleteElement(this.props.id);
  };

  toggleStateOnElement = () => {
    console.log('Element.toggleStateOnElement()', this.props.id);
    let state;

    switch(this.props.state) {
      case 'onHold':
        state = 'toBuy';
        break;
      case 'toBuy':
        state = 'bought'
        break;
      case 'bought':
        state = 'onHold';
        break
    }

    this.props.updateElement({ id: this.props.id, state: state });
  };

  render() {
    let icon;
    let color;

    switch(this.props.state) {
      case 'onHold':
        icon = 'edit';
        color = 'brown';
        break;
      case 'toBuy':
        icon = 'shopping basket'
        color = 'red';
        break;
      case 'bought':
        icon = 'checkmark';
        color = 'green';
        break
    }

    return (
      <div className={'card ' + color}>
        <div
          className='content'
          onClick={this.toggleStateOnElement}
        >
          <i className={'right floated icon ' + icon + ' ' + color} />

          <div className='header'>
            {this.props.title}
          </div>
        </div>

        <div className='extra content'>
          <span
            className='right floated edit icon'
            onClick={this.props.onEditButtonClick}
          >
            <i className='edit icon' />
          </span>
          <span
            className='right floated trash icon'
            onClick={this.deleteElement}
          >
            <i className='trash icon' />
          </span>
        </div>
      </div>
    );
  }
}

class ElementsFilter extends React.Component {
  addClassIfActive = (menuValue, className) => {
    if(this.props.selectedFilter === menuValue) {
      return className;
    } else {
      return '';
    }
  };

  updateSelectedList = (e) => {
    let selectedListId = e.target.attributes.getNamedItem("data-list-id").value;
    this.props.updateSelectedList(selectedListId);
  };

  componentDidMount() {
    $('.ui.dropdown').dropdown();
  };

  listLinks = () => {
    console.log("ElementsFilter.listLinks.listsSummary", this.props.listsSummary);
    return (
      this.props.listsSummary.map( (list) => {
        console.log("list", list);
        return (<div className="item" key={list.id} data-list-id={list.id} onClick={this.updateSelectedList}>{list.name}</div>)
      })
    )
  };

  openNewListModal = () => {
    $('.ui.modal.editform').modal('show');
  };

  render() {
    return (
      <div className="ui stackable menu" id="navbar">
        <div className="item">
          <img src="./assets/quick_shopping_list_logo.png" />
        </div>
        <a className={'item ' + this.addClassIfActive('all', 'teal active')} data-value="all" onClick={this.props.updateSelectedFilter}>
          All
          <div className={'ui label ' + this.addClassIfActive('all', 'teal left pointing')}>{this.props.elementsCounters.all}</div>
        </a>
        <a className={'item ' + this.addClassIfActive('toBuy', 'active')} data-value="toBuy" onClick={this.props.updateSelectedFilter}>
          To Buy
          <div className={'ui label ' + this.addClassIfActive('toBuy', 'teal left pointing')}>{this.props.elementsCounters.toBuy}</div>
        </a>
        <a className={'item ' + this.addClassIfActive('bought', 'active')} data-value="bought" onClick={this.props.updateSelectedFilter}>
          Bought
          <div className={'ui label ' + this.addClassIfActive('bought', 'teal left pointing')}>{this.props.elementsCounters.bought}</div>
        </a>
        <a className={'item ' + this.addClassIfActive('onHold', 'active')} data-value="onHold" onClick={this.props.updateSelectedFilter}>
          On Hold
          <div className={'ui label ' + this.addClassIfActive('onHold', 'teal left pointing')}>{this.props.elementsCounters.onHold}</div>
        </a>

        <div className="ui right dropdown item">
          Lists
          <i className="dropdown icon"></i>
          <div className="menu">
            {this.listLinks()}
            <div className="divider"></div>
            <div className="item" onClick={this.openNewListModal}>Create new List</div>
          </div>
        </div>
      </div>
    );
  };
};

class NewListModal extends React.Component {
  handleSubmit = () => {
    console.log('NewListModalNewListModal.handleSubmit()');

    this.props.createList({
      name: $('#new-list-name-element').val()
    });

    $('.ui.modal.editform').modal('hide');
  };

  handleCancel = () => {
    console.log("NewListModal.handleCancel()");
    $('.ui.modal.editform').modal('hide');
  };

  componentDidMount() {
    $('.ui.modal').modal({ detachable: false });
  };

  render(){
    return (
      <div className="ui modal editform">
          <i className="close icon"></i>
          <div className="header">Create New List</div>
          <div className="content">
            <div className='ui form'>
              <div className='field'>
                <label>Title</label>
                <input
                  type='text'
                  id='new-list-name-element'
                />
              </div>
              <div className='ui two bottom attached buttons'>

                <button
                  className='ui basic blue button'
                  onClick={this.handleSubmit}
                >
                  Save
                </button>

                <button
                  className='ui basic red button'
                  onClick={this.handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
      </div>
    );
  };
};

ReactDOM.render(
  <ShoppingList />,
  document.getElementById('content')
);