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
  static defaultZIndex = 0;
  static overlayRef;
  static pageElementRef;
  static floatingUIContainer = [];
  static isEventListenerAdded = false;
  componentDidMount() {
    // Append the element into the DOM on mount. We'll render
    // into the modal container element (see the HTML tab).
    modalRoot.appendChild(this.el);
    this.props.reference.current.focus();
    Modal.elementReferences.push({
      elemRef: this.props.reference.current,
      closePopUp: this.props.closeDialog,
    });
    Modal.floatingUIContainer.push(this.el);
    if (typeof this.props.pageref !== 'undefined') {
      Modal.pageElementRef = this.props.pageref;
    }
    if (typeof this.props.overlayref !== 'undefined') {
      Modal.overlayRef = this.props.overlayref;
    }
    console.log(Modal.overlayRef);
    if (Modal.overlayRef != undefined) {
      Modal.overlayRef.current.style.display = 'block';
    }
    this.el.style.position = 'relative';
    let modalCount = +Modal.elementReferences.length;
    console.log('modalCount', modalCount);
    console.log('Modal.defaultZIndex', Modal.defaultZIndex);
    // Modal.overlayRef.current.style.zIndex = Modal.defaultZIndex;
    this.el.style.zIndex = +Modal.defaultZIndex + +modalCount;
    this.el.style.backgroundColor = '#ffffff';
    Modal.defaultZIndex = +this.el.style.zIndex;
    Modal.overlayRef.current.style.zIndex = +Modal.defaultZIndex;

    console.log(Modal.overlayRef.current.style.zIndex);
    let that = this;
    if (!Modal.isEventListenerAdded) {
      document.addEventListener('keydown', this.handleKeyPressEvent, false);
      Modal.isEventListenerAdded = true;
    }
  }
  handleKeyPressEvent(event) {
    if (event.key === 'Escape') {
      console.log('Inside Escape CallBack');
      let topMostFloatinUIElem = Modal.elementReferences.pop();
      let topMostElemCloseFn = topMostFloatinUIElem.closePopUp;
      topMostElemCloseFn();
      let topMostFloatingElem = Modal.floatingUIContainer.pop();
      console.log('topMostFloatingElem', topMostFloatingElem);
      modalRoot.removeChild(topMostFloatingElem);
    } else {
      keyDownHandler(
        event,
        Modal.floatingUIContainer[Modal.floatingUIContainer.length - 1]
      );
    }
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
    console.log('Inside Component Will UnMount');
    // Remove the element from the DOM when we unmount

    let length = Modal.elementReferences.length;
    let newElementReference = Modal.elementReferences[length - 1];
    console.log('element reference', Modal.elementReferences);
    console.log('floatingUIContainer', Modal.floatingUIContainer);
    if (typeof newElementReference !== 'undefined') {
      console.log('Inside Multi Case');
      newElementReference.elemRef.focus();
      let currentFloatingUIContainer =
        Modal.floatingUIContainer[Modal.floatingUIContainer.length - 1];
      currentFloatingUIContainer.style.zIndex = Modal.defaultZIndex;
      //Modal.defaultZIndex--;
      console.log('Inside unmount', Modal.elementReferences);
    } else {
      console.log('Inside Last Case');
      let rootElem = Modal.pageElementRef;
      rootElem.current.focus();
      Modal.overlayRef.current.style.display = 'none';
      Modal.overlayRef.current.style.zIndex = '';
      Modal.overlayRef = null;
      Modal.pageElementRef = null;
      Modal.defaultZIndex = 0;
      document.removeEventListener('keydown', this.handleKeyPressEvent);
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
