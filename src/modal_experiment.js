import React from 'react';
import ReactDOM from 'react-dom';
import focusTrap from './focusTrap';

let newFloatingUIContainerElementList = [];
let overlayReference;
let pageElementReference;
let defaultZIndex = 0;
let isKeyDownEventListenerConfigured = false;
export default class Modal extends React.Component {
  constructor(props) {
    super(props);
    // Create a div that we'll render the modal into. Because each
    // Modal component has its own element, we can render multiple
    // modal components into the modal container.

    this.el = document.createElement('div');
    this.el.className = 'floatingcontainer_' + new Date().getTime();
    this.renderProps = {};
    let { renderComponent, ...basicProps } = props;
    this.isEscapeKeyPressed = false;
    this.bindKeyDownEventToDocument =
      this.bindKeyDownEventToDocument.bind(this);
    this.handleKeyPressEvent = this.handleKeyPressEvent.bind(this);
    this.isKeyDownEventListenerConfigured = false;
    console.log(props);
  }

  componentDidMount() {
    console.log('inside cdidmount');
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
  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps, prevState);
  }

  mapFloatingContainerWithDIalogElement() {
    newFloatingUIContainerElementList.push({
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
    let styleObj = { zIndex: +defaultZIndex };
    // console.log(this.props.overlayref);
    if (typeof this.props.overlayref !== 'undefined') {
      let count = newFloatingUIContainerElementList.length;
      styleObj = { zIndex: +defaultZIndex + +count };
    }
    Object.assign(modalObj.style, styleObj);
  }

  persistZIndexValue(elemObj) {
    if (typeof this.props.overlayref !== 'undefined') {
      defaultZIndex = +elemObj.style.zIndex;
    }
  }

  applyFocusToFloatingDialogElement(refClass) {
    let indexOfContainerElement = this.getIndexOfContainerElement(refClass);
    let floatingContainerObj =
      newFloatingUIContainerElementList[indexOfContainerElement][refClass];
    floatingContainerObj.dialogElemRef.focus();
  }

  getDialogElementReference(index, refClass) {
    return newFloatingUIContainerElementList[index][refClass].dialogElemRef;
  }
  bindKeyDownEventToDocument() {
    if (!isKeyDownEventListenerConfigured) {
      document.removeEventListener('keydown', this.handleKeyPressEvent, true);
      document.addEventListener('keydown', this.handleKeyPressEvent, true);

      isKeyDownEventListenerConfigured = true;
    }
  }

  handleKeyPressEvent(event) {
    if (event.eventPhase === 3) {
      return false;
    }
    if (event.key === 'Escape') {
      this.isEscapeKeyPressed = true;
      let floatingDialogContinerClassName =
        this.getClassNameOfClosestContainerElement(event.target);
      let indexOfContainerElement = this.getIndexOfContainerElement(
        floatingDialogContinerClassName
      );
      if (floatingDialogContinerClassName !== undefined) {
        this.invokeCloseCallBackFunctionOfDialogElement(
          indexOfContainerElement,
          floatingDialogContinerClassName
        );
      }
    } else if (event.key === 'Tab') {
      let floatingDialogContinerClassName =
        this.getClassNameOfClosestContainerElement(event.target);
      if (floatingDialogContinerClassName !== undefined) {
        let indexOfContainerElement = this.getIndexOfContainerElement(
          floatingDialogContinerClassName
        );

        focusTrap(
          event,
          newFloatingUIContainerElementList[indexOfContainerElement][
            floatingDialogContinerClassName
          ].floatinguicontainerelement
        );
      }
    }
  }
  getClassNameOfClosestContainerElement(elemObj) {
    if (elemObj.closest('div[class^=floatingcontainer_]') !== null) {
      return elemObj.closest('div[class^=floatingcontainer_]').className;
    }
  }

  getClassNameOfContainerElement(index) {
    let containerObj = newFloatingUIContainerElementList[index];
    return Object.keys(containerObj)[0];
  }

  getContainerElement(index) {
    let containerObj = newFloatingUIContainerElementList[index];
    return containerObj[Object.keys(containerObj)[0]];
  }

  getIndexOfContainerElement(valueToMatch) {
    let that = this;
    return newFloatingUIContainerElementList.findIndex(function (element) {
      return that.findIndexOfContainerElement(element, valueToMatch);
    });
  }
  findIndexOfContainerElement(element, floatingDialogContinerClassName) {
    return Object.keys(element)[0] == floatingDialogContinerClassName;
  }

  removeFloatingUIContainerElement(index, refClass) {
    console.log(index, refClass, newFloatingUIContainerElementList);
    console.log(newFloatingUIContainerElementList[index]);
    if (Object.keys(newFloatingUIContainerElementList[index])[0] === refClass) {
      let floatingContainerObj =
        newFloatingUIContainerElementList[index][refClass];

      let floatingContainerElem =
        floatingContainerObj.floatinguicontainerelement;

      //this.isKeyDownEventListenerConfigured = false;
      //this.unbindKeyDownEventListener();
      let modalRoot = floatingContainerObj.modalroot;
      modalRoot.removeChild(floatingContainerElem);
      newFloatingUIContainerElementList.splice(index, 1);

      if (newFloatingUIContainerElementList.length > 0) {
        let topElement = this.getContainerElement(
          newFloatingUIContainerElementList.length - 1
        );
        topElement.floatinguicontainerelement.style.zIndex = +defaultZIndex;
      }

      if (newFloatingUIContainerElementList.length === 0) {
        this.resetModalBoxValues();
      } else {
        let topElem = this.getContainerElement(
          newFloatingUIContainerElementList.length - 1
        );
        topElem.dialogElemRef.focus();
      }
    }
  }

  invokeCloseCallBackFunctionOfDialogElement(indexOfDialogElement, refClass) {
    newFloatingUIContainerElementList[indexOfDialogElement][
      refClass
    ].functionReferenceToClose();
    //  Modal.removeTopMostFloatingDialogElement().functionReferenceToClose();
  }

  getTopMostFloatingUIContainerElement(refClass) {
    let lengthOfUIContainerElement = newFloatingUIContainerElementList.length;

    return newFloatingUIContainerElementList[lengthOfUIContainerElement - 1][
      refClass
    ].floatinguicontainerelement;
  }
  getFloatingUIContainerElement(index, refClass) {
    return newFloatingUIContainerElementList[index][refClass]
      .floatinguicontainerelement;
  }

  resetDefaultZIndex() {
    defaultZIndex = 0;
  }

  persistPageElementReference() {
    if (typeof this.props.pageref !== 'undefined') {
      pageElementReference = this.props.pageref;
    }
  }
  applyFocusToPageElementReference() {
    pageElementReference.current.focus();
  }
  resetPageElementReference() {
    pageElementReference = null;
  }

  applyZIndexToOverlayEement() {
    if (typeof this.props.overlayref !== 'undefined') {
      overlayReference.style.zIndex = +defaultZIndex;
    }
  }

  persistOverlayElementReference() {
    if (typeof this.props.overlayref !== 'undefined') {
      overlayReference = this.props.overlayref.current;
    }
  }
  showOverlayElement() {
    if (overlayReference != undefined) {
      overlayReference.style.display = 'block';
    }
  }
  applyStyleToOverlayElement(styleObj) {
    Object.assign(overlayReference.style, styleObj);
  }
  resetOverlayReference() {
    overlayReference = null;
  }
  resetisEventListenerAddedProperty() {
    isKeyDownEventListenerConfigured = false;
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
    this.resetOverlayReference();
    this.resetisEventListenerAddedProperty();
    this.unbindKeyDownEventListener();
  }
  componentWillUnmount() {
    console.log('Inside componentWillUnmount');
    let indexOfContainerElement = this.getIndexOfContainerElement(
      this.el.className
    );
    this.removeFloatingUIContainerElement(
      indexOfContainerElement,
      this.el.className
    );
    this.isEscapeKeyPressed = false;
  }

  render() {
    console.log('inside render');
    // this.props.children.ref = this.elemenetRef;
    // Use a portal to render the children into the element
    return ReactDOM.createPortal(
      // Any valid React child: JSX, strings, arrays, etc.
      this.props.children,
      // A DOM element
      this.el
    );
  }
}
