import React from 'react';
import Modal from './modal.js';
import Dialog from './Dialog.js';
import DialogTwo from './Dialog2.js';
import './style.css';

// The Modal component is a normal React component, so we can
// render it wherever we like without needing to know that it's
// implemented with portals.

export default class TopMostModal extends React.Component {
  constructor(props) {
    super(props);

    this.withoutoverlayref = React.createRef();
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <Modal
          modalrootreference={document.getElementById('modal-root1')}
          reference={this.withoutoverlayref}
          overlayref={this.props.overlayref}
          closeDialog={() => {
            this.props.closeDialog();
          }}
        >
          <DialogTwo
            elementRef={this.withoutoverlayref}
            closeDialog={this.props.closeDialog}
          ></DialogTwo>
        </Modal>
      </div>
    );
  }
}
