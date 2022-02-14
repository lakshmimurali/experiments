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
  static floatingelementReferencesListToApplyFocus = [];
  static defaultZIndex = 0;
  static overlayRef;
  static pageElementReference;
  static floatingUIContainerElement = [];
  static isEventListenerAdded = false;
  static isKeyDownEventListenerConfigured = false;
  static isEscapeKeyPressed = false;
  componentDidMount() {
    // Append the element into the DOM on mount. We'll render
    // into the modal container element (see the HTML tab).
    modalRoot.appendChild(this.el);
    bindKeyDownEventToDocument();
  }
  bindKeyDownEventToDocument() {
    if (!Modal.isEventListenerAdded) {
      document.addEventListener('keydown', this.handleKeyPressEvent, false);
      Modal.isEventListenerAdded = true;
    }
  }
  persistFloatingUIContainerElement() {
    Modal.floatingUIContainer.push(this.el);
  }
  persistFloatingElementReferenceList() {
    Modal.elementReferences.push({
      floatingElemRef: this.props.reference.current,
      functionReferenceToClose: this.props.closeDialog,
    });
  }
  applyFocusToFloatingElement() {
    this.props.reference.current.focus();
  }
  applyStyleTofloatingUIContainerElement() {
    let count = +Modal.elementReferences.length;
    this.el.style.position = 'relative';
    this.el.style.zIndex = +Modal.defaultZIndex + +count;
    this.el.style.backgroundColor = '#ffffff';
  }
  persistZIndexValue() {
    Modal.defaultZIndex = +this.el.style.zIndex;
  }
  applyZIndexToOverlayEement() {
    Modal.overlayRef.current.style.zIndex = +Modal.defaultZIndex;
  }
  handleKeyPressEvent(event) {
    if (event.key === 'Escape') {
      Modal.isEscapeEvent = true;
      console.log('Inside Escape CallBack');
      let topMostFloatingContainer = Modal.floatingUIContainer.pop();
      //modalRoot.removeChild(modalRoot.lastChild);
      modalRoot.removeChild(topMostFloatingContainer);
      let topMostFloatingUIElem = Modal.elementReferences.pop();
      let topMostElemCloseFn = topMostFloatingUIElem.closePopUp;
      topMostElemCloseFn();
    } else {
      keyDownHandler(
        event,
        Modal.floatingUIContainer[Modal.floatingUIContainer.length - 1]
      );
    }
  }

  persistPageElementReference() {
    if (typeof this.props.pageref !== 'undefined') {
      Modal.pageElementRef = this.props.pageref;
    }
  }
  persistOverlayElementReference() {
    if (typeof this.props.overlayref !== 'undefined') {
      Modal.overlayRef = this.props.overlayref;
    }
  }
  showOverlayElement() {
    if (Modal.overlayRef != undefined) {
      Modal.overlayRef.current.style.display = 'block';
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
    if (!Modal.isEscapeEvent) {
      Modal.elementReferences.pop();
      Modal.floatingUIContainer.pop();
    }
    let length = Modal.elementReferences.length;
    let newElementReference = Modal.elementReferences[length - 1];
    console.log('element reference', Modal.elementReferences);
    console.log('floatingUIContainer', Modal.floatingUIContainer);
    if (typeof newElementReference !== 'undefined') {
      console.log('Inside Multi Case');
      newElementReference.elemRef.focus();
      let currentFloatingUIContainer =
        Modal.floatingUIContainer[Modal.floatingUIContainer.length - 1];
      console.log('Modal.defaultZIndex', Modal.defaultZIndex);
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
      Modal.isEventListenerAdded = false;
    }
    Modal.isEscapeEvent = false;
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
