import React from 'react';
export default function Dialog(props) {
  return (
    <div
      className="modal1"
      role="dialog"
      style={{
        border: '1px solid green',
        height: '200px',
      }}
    >
      <div>
        Sample Input
        <input type="text" ref={props.elementRef} key="exp1_text" />
        <button
          key="2"
          onClick={props.closeDialog}
          style={{
            float: 'right',
            cusrsor: 'pointer',
            position: 'relative',
            top: '-20px',
          }}
        >
          <b>X</b>
        </button>
      </div>

      <br />
    </div>
  );
}
