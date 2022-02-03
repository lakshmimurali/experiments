import React from 'react';
import Modal from './modal.js';
import './style.css';

// The Modal component is a normal React component, so we can
// render it wherever we like without needing to know that it's
// implemented with portals.

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };

    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
  }

  handleShow() {
    this.setState({ showModal: true });
  }

  handleHide() {
    this.setState({ showModal: false });
  }

  render() {
    // Show a Modal on click.
    // (In a real app, don't forget to use ARIA attributes
    // for accessibility!)
    const modal = this.state.showModal ? (
      <Modal>
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
          </p>
          <br />
          <p>
            <button key="2">Dummy Button 1</button>
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
        <p>
          {' '}
          <h3>
            {' '}
            React Portal Experiments.. Needed for the implementation of Modal
            Dialog in the product.
          </h3>
        </p>
        <br />
        <button onClick={this.handleShow} style={{ cursor: 'pointer' }}>
          Show modal
        </button>
        {modal}
      </div>
    );
  }
}
