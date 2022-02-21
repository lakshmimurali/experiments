import React from 'react';
import Modal from './modal.js';
import Dialog from './Dialog.js';
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
    console.log(this.props);
    return (
      <div>
        <Modal
          modalrootreference={document.getElementById('modal-root1')}
          reference={this.elementRef}
          overlayref={this.props.overlayref}
          closeDialog={() => {
            this.props.closeDialog();
          }}
        >
          <Dialog
            elementRef={this.elementRef}
            closeDialog={this.props.closeDialog}
            toggleHandler={this.props.toggleHandler}
          ></Dialog>
        </Modal>
      </div>
    );
  }
}
