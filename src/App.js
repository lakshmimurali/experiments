import React from 'react';
import Modal from './modal.js';
import TopModal from './topModal.js';
import './style.css';

// The Modal component is a normal React component, so we can
// render it wherever we like without needing to know that it's
// implemented with portals.

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false, textValue: '', showTopModal: false };

    this.handleShow = this.handleShow.bind(this);
    this.handleTopModal = this.handleTopModal.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.elementRef = React.createRef();
  }

  handleTopModal() {
    console.log('Inside >>>>>>>>>>>>>>>');
    let toggleState = !this.state.showTopModal;
    this.setState({ showTopModal: toggleState });
  }
  handleShow() {
    this.setState({ showModal: true });
  }

  handleHide() {
    this.setState({ showModal: false });
  }
  changeHandler(event) {
    this.setState({ textValue: event.target.value });
  }

  render() {
    // Show a Modal on click.
    // (In a real app, don't forget to use ARIA attributes
    // for accessibility!)
    const modal = this.state.showModal ? (
      <Modal
        reference={this.elementRef}
        closeDialog={() => {
          this.handleHide();
        }}
      >
        <div
          className="modal"
          role="dialog"
          style={{
            border: '1px solid red',
            padding: '20px',
            height: '200px',
            widht: '200px',
            margin: '20px',
          }}
        >
          <div>
            With a portal, we can render content into a different part of the
            DOM, as if it were any other React child.
          </div>
          This is being rendered inside the #modal-container div.
          <p>
            {' '}
            <button
              key="1"
              onClick={this.handleHide}
              style={{
                float: 'right',
                cusrsor: 'pointer',
                position: 'relative',
                top: '-50px',
              }}
            >
              <b>X</b>
            </button>
            <input
              type="text"
              key="exp_text"
              ref={this.elementRef}
              value={this.state.textValue}
              onChange={this.changeHandler}
            />
          </p>
          <br />
          <p>
            <button key="2" onClick={this.handleTopModal}>
              {' '}
              Click Here{' '}
            </button>
          </p>
          <br />
          <p>
            <button key="3">Dummy Button 2</button>
          </p>
        </div>
      </Modal>
    ) : null;

    return (
      <div className="app">
        {' '}
        <h3>
          {' '}
          React Portal Experiments.. Needed for the implementation of Modal
          Dialog in the product.
        </h3>
        <br />
        <button onClick={this.handleShow} style={{ cursor: 'pointer' }}>
          Show modal
        </button>
        {modal}
        {this.state.showTopModal ? (
          <TopModal
            closeDialog={() => {
              this.handleTopModal();
            }}
          />
        ) : null}
      </div>
    );
  }
}
