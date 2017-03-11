
class ShoppingList extends React.Component {
  state = {
    elements: [
      {
        title: 'peras',
        id: uuid.v4(),
      },
      {
        title: 'manzanas',
        id: uuid.v4(),
      },
    ],
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
  };

  createElement = (attrs) => {
    console.log('ShoppingList.createElement()', attrs);

    const element = {
      title: attrs.title,
      id: uuid.v4()
    }

    this.setState({
      elements: this.state.elements.concat(element)
    });
  };

  deleteElement = (elementId) => {
    console.log('ShoppingList.deleteElement()', elementId);

    this.setState({
      elements: this.state.elements.filter((element) => {
        return element.id !== elementId
      })
    })
  }


  render() {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
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
          updateElement={this.props.updateElement}
          deleteElement={this.props.deleteElement}
        />
      ));

    return (
      <div id='elements'>
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

  render() {
    if (this.state.editFormOpen) {
      return (
        <ElementForm
          id={this.props.id}
          title={this.props.title}
          buttonText='Update'
          handleSubmit={this.updateElement}
        />
      );
    } else {
      return (
        <Element
          id={this.props.id}
          title={this.props.title}
          onEditButtonClick={this.onEditButtonClick}
          deleteElement={this.props.deleteElement}
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
  }

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

              <button className='ui basic red button'>
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

  createElement = (attrs) => {
    this.props.createElement(attrs);
    this.setState({ isOpen: false });
  };

  render() {
    if (this.state.isOpen) {
      return (
        <ElementForm
          buttonText='Create'
          handleSubmit={this.createElement}
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

  render() {
    return (
      <div className='ui centered card'>
        <div className='content'>
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