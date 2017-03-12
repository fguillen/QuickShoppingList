
class ShoppingList extends React.Component {
  state = {
    elements: [],
  };

  loadElementsFromServer = () => {
    console.log('ShoppingList.loadElementsFromServer()');
    this.setState({ elements: clientLocalStorage.getElements() });
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

    clientLocalStorage.updateElement(attrs);
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

    clientLocalStorage.createElement(element);
  };

  deleteElement = (elementId) => {
    console.log('ShoppingList.deleteElement()', elementId);

    this.setState({
      elements: this.state.elements.filter((element) => {
        return element.id !== elementId
      })
    });

    clientLocalStorage.deleteElement({ id: elementId });
  };

  componentDidMount() {
    this.loadElementsFromServer();
    setInterval(this.loadElementsFromServer, 5000);
  };

  render() {
    return (
      <div className='main ui container'>
        <Elements
          elements={this.state.elements}
          updateElement={this.updateElement}
          deleteElement={this.deleteElement}
        />
        <NewElement
          isOpen={true}
          createElement={this.createElement}
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
      <div className='ui six doubling cards'>
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
    console.log('this.props.state', this.props.state);
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

    console.log('icon', icon);

    return (
      <div className={'card ' + color}>
        <div
          className='content'
          onTouchStart={this.toggleStateOnElement}
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

ReactDOM.render(
  <ShoppingList />,
  document.getElementById('content')
);