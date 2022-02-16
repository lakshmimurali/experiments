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
  static modalRootReferenceList = [];
  static floatingUIContainerElementList = [];
  static newFloatingUIContainerElementList = [];
  static dialogElementReferencesList = [];
  static overlayReference;
  static pageElementReference;
  static defaultZIndex = 0;
  static isKeyDownEventListenerConfigured = false;
  static isEscapeKeyPressed = false;
  componentDidMount() {
    console.log('from modal.js', this.props);
    // Append the element into the DOM on mount. We'll render
    // into the modal container element (see the HTML tab).
    console.log(this.props.modalrootreference);
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
      },
    });
  }

  applyStyleToFloatingUIContainerElement(modalObj, styleObj) {
    Object.assign(modalObj.style, styleObj);
  }

  applyZIndexToFloatingContainerElement(modalObj) {
    let styleObj = { zIndex: Modal.defaultZIndex };
    if (typeof this.props.overlayref !== 'undefined') {
      let count = Modal.floatingUIContainerElementList.length;
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
      let floatingDialogContinerClassName =
        Modal.getClassNameOfClosestContainerElement(event.target);
      let indexOfContainerElement = Modal.getIndexOfContainerElement(
        floatingDialogContinerClassName
      );
      console.log(
        'indexOfContainerElement',
        indexOfContainerElement,
        Modal.newFloatingUIContainerElementList[indexOfContainerElement]
      );
      Modal.isEscapeKeyPressed = true;

      Modal.invokeCloseCallBackFunctionOfDialogElement(
        indexOfContainerElement,
        floatingDialogContinerClassName
      );
      Modal.removeFloatingUIContainerElement(
        indexOfContainerElement,
        floatingDialogContinerClassName
      );
    } else if (event.key === 'Tab') {
      focusTrap(
        event,
        Modal.getTopMostFloatingUIContainerElement(
          Modal.getClassNameOfClosestContainerElement(event.target)
        )
      );
    }
  }
  static getClassNameOfClosestContainerElement(elemObj) {
    return elemObj.closest('div[class^=floatingcontainer_]').className;
  }

  static getIndexOfContainerElement(valueToMatch) {
    return Modal.newFloatingUIContainerElementList.findIndex(function (
      element
    ) {
      return Modal.findIndexOfContainerElement(element, valueToMatch);
    });
  }
  static findIndexOfContainerElement(element, floatingDialogContinerClassName) {
    console.log(Object.keys(element)[0], floatingDialogContinerClassName);
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
    if (
      Object.keys(Modal.newFloatingUIContainerElementList[index])[0] ===
      refClass
    ) {
      let floatingContainerObj =
        Modal.newFloatingUIContainerElementList[index][refClass];

      let floatingContainerElem =
        floatingContainerObj.floatinguicontainerelement;

      let modalRoot = floatingContainerObj.modalroot;
      modalRoot.removeChild(floatingContainerElem);
      Modal.newFloatingUIContainerElementList.splice(index, 1);
    }
  }

  static invokeCloseCallBackFunctionOfDialogElement(
    indexOfDialogElement,
    refClass
  ) {
    console.log(
      indexOfDialogElement,
      refClass,
      Modal.newFloatingUIContainerElementList[indexOfDialogElement][refClass]
    );
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
      Modal.removeFloatingUIContainerElement(
        Modal.getIndexOfContainerElement(this.el.className),
        this.el.className
      );
    }

    if (Modal.newFloatingUIContainerElementList.length > 0) {
      /*this.applyFocusToFloatingDialogElement(
        Modal.getTopMostFloatingUIContainerElement()
      );*/
      /*this.applyZIndexToFloatingContainerElement(
        Modal.getTopMostFloatingUIContainerElement()
      );*/
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
