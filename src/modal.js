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
    if (typeof this.props.pageref !== 'undefined') {
      Modal.pageElementRef = this.props.pageref;
    }
    if (typeof this.props.overlayref !== 'undefined') {
      Modal.overlayRef = this.props.overlayref;
    }
    console.log(Modal.overlayRef);
    if (Modal.overlayRef != undefined) {
      let zIndexofOverlay = Modal.overlayRef.current.style.zIndex;
      console.log(
        zIndexofOverlay,
        Modal.overlayRef.current.style,
        Modal.overlayRef.current.style.display
      );
      Modal.overlayRef.current.style.display = 'block';
    }
    Modal.elementReferences.push(this.props.reference.current);
    let that = this;
    this.el.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        console.log('Inside');
        that.props.closeDialog();
      } else {
        keyDownHandler(event, that.el);
      }
    });
  }
  /*
  focusElement() {
    this.props.reference.current.focus();
  }
  persistElementRefrence() {
    Modal.elementReferences.push(this.props.reference.current);
  }
  addEventListenersForKeyDown() {
    let that = this;
    this.el.addEventListener('keydown', function callBackHandler(event) {
      if (event.key === 'Escape') {
        console.log('Inside');
        that.props.closeDialog();
      } else {
        keyDownHandler(event, that.el);
      }
    });
  }
  removeKeyBoardEventListener() {
    this.ele.removeEventListener('keydown', callBackHandler);
  }
  */
  componentWillUnmount() {
    // Remove the element from the DOM when we unmount
    modalRoot.removeChild(this.el);
    Modal.elementReferences.pop();
    let length = Modal.elementReferences.length;
    let lastElem = Modal.elementReferences[length - 1];
    if (lastElem) {
      lastElem.focus();
      console.log('Inside unmount', Modal.elementReferences);
    } else {
      let rootElem = Modal.pageElementRef;
      rootElem.current.focus();
    }
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
