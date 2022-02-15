import React from 'react';
export default function DialogTwo(props) {
  return (
    <div
      className="modal2"
      role="dialog"
      style={{
        border: '1px solid yellow',
        height: '200px',
      }}
    >
      <div>
        Sample Input 2
        <input type="text" ref={props.elementRef} key="exp2_text" />
        <button
          key="22"
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
