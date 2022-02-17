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
    this.el.className = 'floatingcontainer_' + new Date().getTime();
  }
  static newFloatingUIContainerElementList = [];
  static overlayReference;
  static pageElementReference;
  static defaultZIndex = 0;
  static isKeyDownEventListenerConfigured = false;
  static isEscapeKeyPressed = false;
  componentDidMount() {
    //console.log('from modal.js', this.props);
    // Append the element into the DOM on mount. We'll render
    // into the modal container element (see the HTML tab).
    //console.log(this.props.modalrootreference);
    this.props.modalrootreference.appendChild(this.el);

    this.mapFloatingContainerWithDIalogElement();

    this.applyStyleToFloatingUIContainerElement(this.el, {
      position: 'relative',
      backgroundColor: '#ffffff',
    });
    this.applyZIndexToFloatingContainerElement(this.el);

    this.persistZIndexValue(this.el);

    this.applyFocusToFloatingDialogElement(this.el.className);

    this.persistOverlayElementReference();
    this.showOverlayElement();
    this.applyZIndexToOverlayEement();

    this.persistPageElementReference();

    this.bindKeyDownEventToDocument();
  }
  mapFloatingContainerWithDIalogElement() {
    Modal.newFloatingUIContainerElementList.push({
      [this.el.className]: {
        modalroot: this.props.modalrootreference,
        floatinguicontainerelement: this.el,
        dialogElemRef: this.props.reference.current,
        functionReferenceToClose: this.props.closeDialog,
        isOverlayNeeded: !!this.props.overlayref,
      },
    });
  }

  applyStyleToFloatingUIContainerElement(modalObj, styleObj) {
    Object.assign(modalObj.style, styleObj);
  }

  applyZIndexToFloatingContainerElement(modalObj) {
    let styleObj = { zIndex: Modal.defaultZIndex };
    // console.log(this.props.overlayref);
    if (typeof this.props.overlayref !== 'undefined') {
      let count = Modal.newFloatingUIContainerElementList.length;
      styleObj = { zIndex: Modal.defaultZIndex + +count };
    }
    Object.assign(modalObj.style, styleObj);
  }

  persistZIndexValue(elemObj) {
    if (typeof this.props.overlayref !== 'undefined') {
      Modal.defaultZIndex = elemObj.style.zIndex;
    }
  }

  applyFocusToFloatingDialogElement(refClass) {
    let indexOfContainerElement = Modal.getIndexOfContainerElement(refClass);
    let floatingContainerObj =
      Modal.newFloatingUIContainerElementList[indexOfContainerElement][
        refClass
      ];
    floatingContainerObj.dialogElemRef.focus();
  }

  getDialogElementReference(index, refClass) {
    return Modal.newFloatingUIContainerElementList[index][refClass]
      .dialogElemRef;
  }
  bindKeyDownEventToDocument() {
    if (!this.checkStatusOfKeyDownEventBoundToDocument()) {
      document.addEventListener('keydown', Modal.handleKeyPressEvent, false);
      this.setKeyDownEventBoundToDocumentStatusToTrue();
    }
  }
  checkStatusOfKeyDownEventBoundToDocument() {
    return Modal.isKeyDownEventListenerConfigured;
  }
  setKeyDownEventBoundToDocumentStatusToTrue() {
    Modal.isKeyDownEventListenerConfigured = true;
  }
  static handleKeyPressEvent(event) {
    if (event.key === 'Escape') {
      let floatingDialogContinerClassName =
        Modal.getClassNameOfClosestContainerElement(event.target);
      let indexOfContainerElement = Modal.getIndexOfContainerElement(
        floatingDialogContinerClassName
      );
      if (floatingDialogContinerClassName !== undefined) {
        Modal.isEscapeKeyPressed = true;

        Modal.invokeCloseCallBackFunctionOfDialogElement(
          indexOfContainerElement,
          floatingDialogContinerClassName
        );
        Modal.removeFloatingUIContainerElement(
          indexOfContainerElement,
          floatingDialogContinerClassName
        );
      }
    } else if (event.key === 'Tab') {
      let floatingDialogContinerClassName =
        Modal.getClassNameOfClosestContainerElement(event.target);
      if (floatingDialogContinerClassName !== undefined) {
        let indexOfContainerElement = Modal.getIndexOfContainerElement(
          floatingDialogContinerClassName
        );
        focusTrap(
          event,
          Modal.newFloatingUIContainerElementList[indexOfContainerElement][
            floatingDialogContinerClassName
          ].floatinguicontainerelement
        );
      }
    }
  }
  static getClassNameOfClosestContainerElement(elemObj) {
    if (elemObj.closest('div[class^=floatingcontainer_]') !== null) {
      return elemObj.closest('div[class^=floatingcontainer_]').className;
    }
  }

  static getClassNameOfContainerElement(index) {
    let containerObj = Modal.newFloatingUIContainerElementList[index];
    return Object.keys(containerObj)[0];
  }

  static getContainerElement(index) {
    let containerObj = Modal.newFloatingUIContainerElementList[index];
    return containerObj[Object.keys(containerObj)[0]];
  }

  static getIndexOfContainerElement(valueToMatch) {
    return Modal.newFloatingUIContainerElementList.findIndex(function (
      element
    ) {
      return Modal.findIndexOfContainerElement(element, valueToMatch);
    });
  }
  static findIndexOfContainerElement(element, floatingDialogContinerClassName) {
    return Object.keys(element)[0] == floatingDialogContinerClassName;
  }
  static removeTopMostFloatingUIContainerElement() {
    let topMostFloatingContainerObj =
      Modal.floatingUIContainerElementList.pop();

    let topMostFloatingContainer =
      topMostFloatingContainerObj.floatinguicontainerelement;

    let modalRoot = topMostFloatingContainerObj.modalroot;
    modalRoot.removeChild(topMostFloatingContainer);
  }
  static removeFloatingUIContainerElement(index, refClass) {
    //console.log(index, refClass);
    if (
      Object.keys(Modal.newFloatingUIContainerElementList[index])[0] ===
      refClass
    ) {
      let floatingContainerObj =
        Modal.newFloatingUIContainerElementList[index][refClass];

      let floatingContainerElem =
        floatingContainerObj.floatinguicontainerelement;

      let isOverlayApplied = floatingContainerElem.isOverlayNeeded;

      let modalRoot = floatingContainerObj.modalroot;
      modalRoot.removeChild(floatingContainerElem);
      Modal.newFloatingUIContainerElementList.splice(index, 1);
      if (
        isOverlayApplied &&
        Modal.newFloatingUIContainerElementList.length > 0
      ) {
        let topElement = Modal.getContainerElement(
          Modal.newFloatingUIContainerElementList.length - 1
        );
        topElement.floatinguicontainerelement.style.zIndex =
          +Modal.defaultZIndex;
      }
      if (Modal.newFloatingUIContainerElementList.length === 0) {
        Modal.resetModalBoxValues();
      }
    }
  }

  static invokeCloseCallBackFunctionOfDialogElement(
    indexOfDialogElement,
    refClass
  ) {
    Modal.newFloatingUIContainerElementList[indexOfDialogElement][
      refClass
    ].functionReferenceToClose();
    //  Modal.removeTopMostFloatingDialogElement().functionReferenceToClose();
  }

  static getTopMostFloatingUIContainerElement(refClass) {
    let lengthOfUIContainerElement =
      Modal.newFloatingUIContainerElementList.length;

    return Modal.newFloatingUIContainerElementList[
      lengthOfUIContainerElement - 1
    ][refClass].floatinguicontainerelement;
  }
  static getFloatingUIContainerElement(index, refClass) {
    return Modal.newFloatingUIContainerElementList[index][refClass]
      .floatinguicontainerelement;
  }

  static resetDefaultZIndex() {
    Modal.defaultZIndex = 0;
  }

  persistPageElementReference() {
    if (typeof this.props.pageref !== 'undefined') {
      Modal.pageElementReference = this.props.pageref;
    }
  }
  static applyFocusToPageElementReference() {
    Modal.pageElementReference.current.focus();
  }
  static resetPageElementReference() {
    Modal.pageElementReference = null;
  }

  applyZIndexToOverlayEement() {
    if (typeof this.props.overlayref !== 'undefined') {
      Modal.overlayReference.style.zIndex = Modal.defaultZIndex;
    }
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
  static applyStyleToOverlayElement(styleObj) {
    Object.assign(Modal.overlayReference.style, styleObj);
  }
  static resetOverlayReference() {
    Modal.overlayReference = null;
  }
  static resetisEventListenerAddedProperty() {
    Modal.isKeyDownEventListenerConfigured = false;
  }
  static unbindKeyDownEventListener() {
    document.removeEventListener('keydown', Modal.handleKeyPressEvent);
  }
  static resetModalBoxValues() {
    //Restore Focus
    Modal.applyFocusToPageElementReference();

    Modal.resetPageElementReference();
    Modal.resetDefaultZIndex();
    Modal.applyStyleToOverlayElement({ display: 'none', zIndex: '' });
    Modal.resetOverlayReference();
    Modal.resetisEventListenerAddedProperty();
    Modal.unbindKeyDownEventListener();
  }
  componentWillUnmount() {
    // Remove the element from the DOM when we unmount
    let indexOfContainerElement = Modal.getIndexOfContainerElement(
      this.el.className
    );
    let numberOfDialogs = Modal.newFloatingUIContainerElementList.length;
    console.log('sizeOfContainerElementList', numberOfDialogs);

    let indexToFetch = -1;

    if (numberOfDialogs > 1) {
      indexToFetch = numberOfDialogs - 2;
    }
    console.log('indexOfContainerElement', indexOfContainerElement);
    console.log('indexToFetch', indexToFetch);
    if (indexToFetch !== -1) {
      let prevElem = Modal.getContainerElement(indexToFetch);
      prevElem.dialogElemRef.focus();
    }
    if (!Modal.isEscapeKeyPressed) {
      Modal.removeFloatingUIContainerElement(
        indexOfContainerElement,
        this.el.className
      );
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
