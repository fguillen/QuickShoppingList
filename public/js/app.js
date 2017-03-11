
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

  render() {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
          <Elements
            elements={this.state.elements}
          />
          <NewElement
            isOpen={true}
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

  render() {
    if (this.state.editFormOpen) {
      return (
        <ElementForm
          title={this.props.title}
        />
      );
    } else {
      return (
        <Element
          title={this.props.title}
          onEditButtonClick={this.onEditButtonClick}
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

  render() {
    let button;

    if(this.props.title) {
      button =  (
        <button className='ui basic blue button'>
          Update
        </button>
      );
    } else {
      button = (
        <button className='ui basic blue button'>
          Create
        </button>
      )
    }

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

              {button}

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

  render() {
    if (this.state.isOpen) {
      return (
        <ElementForm />
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
          <span className='right floated trash icon'>
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