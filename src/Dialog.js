import React from 'react';
export default function Dialog(props) {
  console.log(props);
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
        <p>
          <button
            key="4"
            style={{ cursor: 'pointer' }}
            onClick={props.toggleHandler}
          >
            Open Dialog Without Freeze{' '}
          </button>
        </p>
      </div>

      <br />
    </div>
  );
}
