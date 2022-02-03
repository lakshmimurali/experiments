import React from 'react';
import ReactDOM from 'react-dom';
import keyDownHandler from './focusTrap';

const modalRoot = document.getElementById('modal-root');

export default class Modal extends React.Component {
  constructor(props) {
    super(props);
    // Create a div that we'll render the modal into. Because each
    // Modal component has its own element, we can render multiple
    // modal components into the modal container.
    this.el = document.createElement('div');
  }
  static elementReferences = [];
  componentDidMount() {
    // Append the element into the DOM on mount. We'll render
    // into the modal container element (see the HTML tab).
    modalRoot.appendChild(this.el);
    this.props.reference.current.focus();
    Modal.elementReferences.push(this.props.reference.current);
    console.log('Inside Mount', Modal.elementReferences);
    let that = this;
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        console.log('Inside');
        that.props.closeDialog();
      } else {
        keyDownHandler(event, that.el);
      }
    });
  }

  componentWillUnmount() {
    // Remove the element from the DOM when we unmount
    modalRoot.removeChild(this.el);
    Modal.elementReferences.pop();
    let length = Modal.elementReferences.length;
    let lastElem = Modal.elementReferences[length - 1];
    lastElem.focus();
    console.log('Inside unmount', Modal.elementReferences);
  }

  render() {
    // Use a portal to render the children into the element
    return ReactDOM.createPortal(
      // Any valid React child: JSX, strings, arrays, etc.
      this.props.children,
      // A DOM element
      this.el
    );
  }
}
