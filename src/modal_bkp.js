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
  static dialogElementReferencesList = [];
  static defaultZIndex = 0;
  static overlayReference;
  static pageElementReference;
  static floatingUIContainerElementList = [];
  static isKeyDownEventListenerConfigured = false;
  static isEscapeKeyPressed = false;
  componentDidMount() {
    // Append the element into the DOM on mount. We'll render
    // into the modal container element (see the HTML tab).
    modalRoot.appendChild(this.el);
    this.persistFloatingUIContainerElement();
    this.applyStyleTofloatingUIContainerElement();

    this.persistFloatingDialogElementReference();
    this.applyFocusToFloatingDialogElement();

    this.persistOverlayElementReference();
    this.showOverlayElement();

    this.persistPageElementReference();
    this.bindKeyDownEventToDocument();
  }
  bindKeyDownEventToDocument() {
    if (!Modal.isKeyDownEventListenerConfigured) {
      document.addEventListener('keydown', this.handleKeyPressEvent, false);
      Modal.isKeyDownEventListenerConfigured = true;
    }
  }
  persistFloatingUIContainerElement() {
    Modal.floatingUIContainerElementList.push(this.el);
  }
  applyStyleTofloatingUIContainerElement() {
    let count = +Modal.floatingUIContainerElementList.length;
    this.el.style.position = 'relative';
    this.el.style.zIndex = +Modal.defaultZIndex + +count;
    this.el.style.backgroundColor = '#ffffff';
  }

  persistFloatingDialogElementReference() {
    Modal.dialogElementReferencesList.push({
      dialogElemRef: this.props.reference.current,
      functionReferenceToClose: this.props.closeDialog,
    });
  }
  applyFocusToFloatingDialogElement() {
    this.getTopMostDialogElementReference().dialogElemRef.focus();
  }

  persistZIndexValue() {
    Modal.defaultZIndex = +this.el.style.zIndex;
  }
  applyZIndexToOverlayEement() {
    Modal.overlayRef.current.style.zIndex = +Modal.defaultZIndex;
  }
  handleKeyPressEvent(event) {
    if (event.key === 'Escape') {
      Modal.isEscapeKeyPressed = true;
      this.removeTopMostFloatingUIContainerElement();
      this.invokeCloseCallBackFunctionOfTopDialogElement();
    } else {
      focusTrap(event, this.getTopMostFloatingUIContainerElement());
    }
  }

  persistPageElementReference() {
    if (typeof this.props.pageref !== 'undefined') {
      Modal.pageElementReference = this.props.pageref;
    }
  }
  applyFocusToPageElementReference() {
    Modal.pageElementReference.current.focus();
  }
  resetPageElementReference() {
    Modal.pageElementReference = null;
  }
  persistOverlayElementReference() {
    if (typeof this.props.overlayref !== 'undefined') {
      Modal.overlayReference = this.props.overlayref;
    }
  }
  showOverlayElement() {
    if (Modal.overlayReference != undefined) {
      Modal.overlayReference.current.style.display = 'block';
    }
  }
  applyStyleToOverlayElement() {
    Modal.overlayReference.current.style.display = 'none';
    Modal.overlayReference.current.style.zIndex = '';
    Modal.overlayReference = null;
  }

  resetDefaultZIndex() {
    Modal.defaultZIndex = 0;
  }
  unbindKeyDownEventListener() {
    document.removeEventListener('keydown', this.handleKeyPressEvent);
  }
  getTopMostFloatingUIContainerElement() {
    let lengthOfUIContainerElement =
      Modal.floatingUIContainerElementList.length;
    return Modal.floatingUIContainer[lengthOfUIContainerElement - 1];
  }
  getTopMostDialogElementReference() {
    let lengthofDialogElements = Modal.dialogElementReferencesList.length;
    let topDialogElementReference =
      Modal.elementReferences[lengthofDialogElements - 1];
    return topDialogElementReference;
  }

  removeTopMostFloatingUIContainerElement() {
    let topMostFloatingContainer = Modal.floatingUIContainerElementList.pop();
    modalRoot.removeChild(topMostFloatingContainer);
  }
  removeTopMostFloatingDialogElement() {
    let topMostFloatingUIElem = Modal.dialogElementReferencesList.pop();
    return topMostFloatingUIElem();
  }
  invokeCloseCallBackFunctionOfTopMostDialogElement() {
    this.removeTopMostFloatingDialogElement().closePopUp();
  }
  resetisEventListenerAddedProperty() {
    Modal.isKeyDownEventListenerConfigured = false;
  }
  resetModalBoxValues() {
    //Restore Focus
    this.applyFocusToPageElementReference();

    this.resetPageElementReference();
    this.resetDefaultZIndex();
    this.applyStyleToOverlayElement();
    this.unbindKeyDownEventListener();
    this.resetisEventListenerAddedProperty();
  }
  componentWillUnmount() {
    console.log('Inside Component Will UnMount');
    // Remove the element from the DOM when we unmount
    if (!Modal.isEscapeEvent) {
      this.removeTopMostFloatingDialogElement();
      this.removeTopMostFloatingUIContainerElement();
    }

    if (typeof getTopMostDialogElementReference() !== 'undefined') {
      this.applyFocusToFloatingDialogElement();
      this.applyZIndexToFloatingContainerElement();
    } else {
      this.applyFocusToPageElementReference();
      this.resetModalBoxValues();
    }
    Modal.isEscapeKeyPressed = false;
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
