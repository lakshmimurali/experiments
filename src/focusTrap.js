export default function focusTrap(e, containerElement) {
  // only execute if tab is pressed
  if (e.key !== 'Tab') return;
  console.log(containerElement);
  // here we query all focusable elements, customize as your own need
  const focusableModalElements = containerElement.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select'
  );

  //console.log(focusableModalElements);
  const firstElement = focusableModalElements[0];
  const lastElement = focusableModalElements[focusableModalElements.length - 1];
  //console.log(firstElement, lastElement);

  // if going forward by pressing tab and lastElement is active shift focus to first focusable element
  if (!e.shiftKey && document.activeElement === lastElement) {
    firstElement.focus();
    return e.preventDefault();
  }

  // if going backward by pressing tab and firstElement is active shift focus to last focusable element
  if (e.shiftKey && document.activeElement === firstElement) {
    lastElement.focus();
    e.preventDefault();
  }
}
