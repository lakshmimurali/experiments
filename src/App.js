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
    this.pageRef = React.createRef();
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
        pageref={this.pageRef}
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
            height: '230px',
            widht: '200px',
            margin: '20px',
          }}
        >
          <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Dialog 1
          </div>
          <p style={{ backgroundColor: 'yellow', display: 'inline-block' }}>
            Triggered by "Open a Dialog" button.
          </p>
          <p>
            {' '}
            <button
              key="1"
              onClick={this.handleHide}
              style={{
                float: 'right',
                cursor: 'pointer',
                position: 'relative',
                top: '-100px',
                right: '-10px',
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
            <button
              key="2"
              style={{ cursor: 'pointer' }}
              onClick={this.handleTopModal}
            >
              {' '}
              Open Dialog 2{' '}
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
        <h3>Modal Support For UCL using react portal technique:</h3>
        <p>
          {' '}
          This implementation supports the rendering of floating UIs like
          Alert,Confirm Dialogs, Notification Messages, Pop-overs,etc..
        </p>
        <b> Why Modal Implementation exists? </b>
        <p>
          {' '}
          <span style={{ backgroundColor: 'yellow' }}>
            {' '}
            Reusable technique to avoid the duplication in the implementation of
            the required features of floating UIs like{' '}
          </span>
          <ul>
            <li>Trapping keyboard focus within the top most floating UI.</li>
            <li> Closes the floating UI when user presses the escape key </li>
            <li>
              Maintaining the focus order, to correctly focus on the initiator
              UI, when a floating UI got closed.
            </li>
            <li>
              {' '}
              Overlay Support to prevent accessing the underlying application
              while floating UI exists.{' '}
            </li>
          </ul>{' '}
        </p>
        <br />
        <button
          ref={this.pageRef}
          onClick={this.handleShow}
          style={{ cursor: 'pointer' }}
        >
          Open a Dialog
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
