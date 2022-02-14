import React from 'react';
import ReactDOM from 'react-dom';
import focusTrap from './focusTrap';

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
    persistFloatingUIContainerElement();
    applyStyleTofloatingUIContainerElement();

    persistFloatingDialogElementReference();
    applyFocusToFloatingDialogElement();

    persistOverlayElementReference();
    showOverlayElement();

    persistPageElementReference();
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
  applyStyleTofloatingUIContainerElement() {
    let count = +Modal.elementReferences.length;
    this.el.style.position = 'relative';
    this.el.style.zIndex = +Modal.defaultZIndex + +count;
    this.el.style.backgroundColor = '#ffffff';
  }

  persistFloatingDialogElementReference() {
    Modal.elementReferences.push({
      floatingElemRef: this.props.reference.current,
      functionReferenceToClose: this.props.closeDialog,
    });
  }
  applyFocusToFloatingDialogElement() {
    this.props.reference.current.focus();
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
      removeTopMostFloatingUIContainerElement();
      invokeCloseCallBackFunctionOfTopDialogElement();
    } else {
      focusTrap(event, getTopMostFloatingUIContainerElement());
    }
  }

  persistPageElementReference() {
    if (typeof this.props.pageref !== 'undefined') {
      Modal.pageElementRef = this.props.pageref;
    }
  }
  applyFocusToPageElementReference() {
    Modal.pageElementRef.current.focus();
  }
  resetPageElementReference() {
    Modal.pageElementRef = null;
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
  applyStyleToOverlayElement() {
    Modal.overlayRef.current.style.display = 'none';
    Modal.overlayRef.current.style.zIndex = '';
    Modal.overlayRef = null;
  }

  resetDefaultZIndex() {
    Modal.defaultZIndex = 0;
  }
  unbindKeyDownEventListener() {
    document.removeEventListener('keydown', this.handleKeyPressEvent);
  }
  getTopMostFloatingUIContainerElement() {
    let lengthOfUIContainerElement = Modal.floatingUIContainer.length;
    return Modal.floatingUIContainer[lengthOfUIContainerElement - 1];
  }
  getTopMostDialogElementReference() {
    let lengthofDialogElements = Modal.elementReferences.length;
    let topDialogElementReference =
      Modal.elementReferences[lengthofDialogElements - 1];
    return topDialogElementReference;
  }

  removeTopMostFloatingUIContainerElement() {
    let topMostFloatingContainer = Modal.floatingUIContainer.pop();
    modalRoot.removeChild(topMostFloatingContainer);
  }
  removeTopMostFloatingDialogElement() {
    let topMostFloatingUIElem = Modal.elementReferences.pop();
    return topMostFloatingUIElem();
  }
  invokeCloseCallBackFunctionOfTopMostDialogElement() {
    removeTopMostFloatingDialogElement().closePopUp();
  }
  toggleisEventListenerAddedProperty() {
    return !Modal.isEventListenerAdded;
  }
  resetModalBoxValues() {
    applyFocusToPageElementReference();
    resetPageElementReference();
    resetDefaultZIndex();
    applyStyleToOverlayElement();
    unbindKeyDownEventListener();
    toggleisEventListenerAddedProperty();
  }
  componentWillUnmount() {
    console.log('Inside Component Will UnMount');
    // Remove the element from the DOM when we unmount
    if (!Modal.isEscapeEvent) {
      removeTopMostFloatingDialogElement();
      removeTopMostFloatingUIContainerElement();
    }

    if (typeof getTopMostDialogElementReference() !== 'undefined') {
      applyFocusToFloatingDialogElement();
      applyZIndexToFloatingContainerElement();
    } else {
      applyFocusToPageElementReference();
      resetModalBoxValues();
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
