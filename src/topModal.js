import React from 'react';
import Modal from './modal.js';
import './style.css';

// The Modal component is a normal React component, so we can
// render it wherever we like without needing to know that it's
// implemented with portals.

export default class TopModal extends React.Component {
  constructor(props) {
    super(props);

    this.elementRef = React.createRef();
  }

  render() {
    return (
      <Modal
        reference={this.elementRef}
        closeDialog={() => {
          this.props.closeDialog();
        }}
      >
        <div
          className="modal1"
          role="dialog"
          style={{
            border: '1px solid green',
            padding: '20px',
            height: '200px',
            widht: '200px',
            margin: '20px',
          }}
        >
          <div>
            Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah
            <input type="text" ref={this.elementRef} key="exp1_text" />
            <button
              key="2"
              onClick={this.props.closeDialog}
              style={{
                float: 'right',
                cusrsor: 'pointer',
                position: 'relative',
                top: '-20px',
              }}
            >
              <b>X</b>
            </button>
          </div>

          <br />
        </div>
      </Modal>
    );
  }
}
