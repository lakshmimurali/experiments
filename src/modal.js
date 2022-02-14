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
  static floatingUIContainerElementList = [];
  static dialogElementReferencesList = [];
  static overlayReference;
  static pageElementReference;
  static defaultZIndex = 0;
  static isKeyDownEventListenerConfigured = false;
  static isEscapeKeyPressed = false;
  componentDidMount() {
    // Append the element into the DOM on mount. We'll render
    // into the modal container element (see the HTML tab).
    modalRoot.appendChild(this.el);
    this.persistFloatingUIContainerElement();
    this.applyStyleToFloatingUIContainerElement(this.el, {
      position: 'relative',
      backgroundColor: '#ffffff',
    });
    this.applyZIndexToFloatingContainerElement(this.el);

    this.persistZIndexValue(this.el);

    this.persistFloatingDialogElementReference();
    this.applyFocusToFloatingDialogElement();

    this.persistOverlayElementReference();
    this.showOverlayElement();
    this.applyZIndexToOverlayEement();

    this.persistPageElementReference();

    this.bindKeyDownEventToDocument();
  }
  persistFloatingUIContainerElement() {
    Modal.floatingUIContainerElementList.push(this.el);
  }

  applyStyleToFloatingUIContainerElement(modalObj, styleObj) {
    Object.assign(modalObj.style, styleObj);
  }

  applyZIndexToFloatingContainerElement(modalObj) {
    let count = Modal.floatingUIContainerElementList.length;
    let styleObj = { zIndex: Modal.defaultZIndex + +count };
    Object.assign(modalObj.style, styleObj);
  }

  persistZIndexValue(elemObj) {
    Modal.defaultZIndex = elemObj.style.zIndex;
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

  getTopMostDialogElementReference() {
    let lengthofDialogElements = Modal.dialogElementReferencesList.length;
    let topDialogElementReference =
      Modal.dialogElementReferencesList[lengthofDialogElements - 1];
    return topDialogElementReference;
  }

  bindKeyDownEventToDocument() {
    if (!this.checkStatusOfKeyDownEventBoundToDocument()) {
      document.addEventListener('keydown', this.handleKeyPressEvent, false);
      this.setKeyDownEventBoundToDocumentStatusToTrue();
    }
  }
  checkStatusOfKeyDownEventBoundToDocument() {
    return Modal.isKeyDownEventListenerConfigured;
  }
  setKeyDownEventBoundToDocumentStatusToTrue() {
    Modal.isKeyDownEventListenerConfigured = true;
  }
  handleKeyPressEvent(event) {
    if (event.key === 'Escape') {
      Modal.isEscapeKeyPressed = true;
      Modal.removeTopMostFloatingUIContainerElement();
      Modal.invokeCloseCallBackFunctionOfTopMostDialogElement();
    } else {
      focusTrap(event, Modal.getTopMostFloatingUIContainerElement());
    }
  }
  static removeTopMostFloatingUIContainerElement() {
    let topMostFloatingContainer = Modal.floatingUIContainerElementList.pop();
    modalRoot.removeChild(topMostFloatingContainer);
  }

  static invokeCloseCallBackFunctionOfTopMostDialogElement() {
    Modal.removeTopMostFloatingDialogElement().functionReferenceToClose();
  }
  static getTopMostFloatingUIContainerElement() {
    let lengthOfUIContainerElement =
      Modal.floatingUIContainerElementList.length;
    return Modal.floatingUIContainerElementList[lengthOfUIContainerElement - 1];
  }

  static removeTopMostFloatingDialogElement() {
    let topMostFloatingUIElem = Modal.dialogElementReferencesList.pop();
    return topMostFloatingUIElem;
  }

  resetDefaultZIndex() {
    Modal.defaultZIndex = 0;
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

  applyZIndexToOverlayEement() {
    Modal.overlayReference.style.zIndex = Modal.defaultZIndex;
  }

  persistOverlayElementReference() {
    if (typeof this.props.overlayref !== 'undefined') {
      Modal.overlayReference = this.props.overlayref.current;
    }
  }
  showOverlayElement() {
    if (Modal.overlayReference != undefined) {
      Modal.overlayReference.style.display = 'block';
    }
  }
  applyStyleToOverlayElement(styleObj) {
    Object.assign(Modal.overlayReference.style, styleObj);
  }
  resetOverlayReference() {
    Modal.overlayReference = null;
  }
  resetisEventListenerAddedProperty() {
    Modal.isKeyDownEventListenerConfigured = false;
  }
  unbindKeyDownEventListener() {
    document.removeEventListener('keydown', this.handleKeyPressEvent);
  }
  resetModalBoxValues() {
    //Restore Focus
    this.applyFocusToPageElementReference();

    this.resetPageElementReference();
    this.resetDefaultZIndex();
    this.applyStyleToOverlayElement({ display: 'none', zIndex: '' });
    this.unbindKeyDownEventListener();
    this.resetisEventListenerAddedProperty();
  }
  componentWillUnmount() {
    // Remove the element from the DOM when we unmount
    if (!Modal.isEscapeKeyPressed) {
      Modal.removeTopMostFloatingDialogElement();
      Modal.removeTopMostFloatingUIContainerElement();
    }

    if (typeof this.getTopMostDialogElementReference() !== 'undefined') {
      this.applyFocusToFloatingDialogElement();
      this.applyZIndexToFloatingContainerElement(
        Modal.getTopMostFloatingUIContainerElement()
      );
    } else {
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
