import React from 'react';
import Modal from './modal.js';
import Dialog from './Dialog.js';
import DialogTwo from './Dialog2.js';
import './style.css';

// The Modal component is a normal React component, so we can
// render it wherever we like without needing to know that it's
// implemented with portals.

export default class TopModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModalWithoutOverlay: false };

    this.elementRef = React.createRef();
    this.withoutoverlayref = React.createRef();
    this.handleModalWithoutOverlay = this.handleModalWithoutOverlay.bind(this);
  }
  handleModalWithoutOverlay() {
    let toggleState = !this.state.showModalWithoutOverlay;
    console.log('Inside handleModalWithoutOverlay CBF');
    this.setState({ showModalWithoutOverlay: toggleState });
  }
  render() {
    return (
      <div>
        <Modal
          modalrootreference={document.getElementById('modal-root1')}
          reference={this.elementRef}
          closeDialog={() => {
            this.props.closeDialog();
          }}
        >
          <Dialog
            elementRef={this.elementRef}
            closeDialog={this.props.closeDialog}
            toggleHandler={this.handleModalWithoutOverlay}
          ></Dialog>
        </Modal>
        {this.state.showModalWithoutOverlay ? (
          <Modal
            modalrootreference={document.getElementById('modal-root1')}
            reference={this.withoutoverlayref}
            closeDialog={() => {
              this.handleModalWithoutOverlay();
            }}
          >
            <DialogTwo
              elementRef={this.withoutoverlayref}
              closeDialog={this.handleModalWithoutOverlay}
            ></DialogTwo>
          </Modal>
        ) : null}
      </div>
    );
  }
}
