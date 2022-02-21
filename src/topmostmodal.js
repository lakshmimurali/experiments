import React from 'react';
import Modal from './modal.js';
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
          modalrootreference={document.getElementById('modal-root1')} // can get ID instead of element
          reference={this.withoutoverlayref} // 1.focusFunction as attribute Can get function to focus 2. based on autofocus we can do
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
