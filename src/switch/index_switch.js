import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import ReactSwitch from './App';

const BasicHooksExample = () => {
  const [checked, setChecked] = useState(false);
  const handleChange = (nextChecked) => {
    setChecked(nextChecked);
  };

  return (
    <div className="example">
      <h2>Simple usage</h2>
      <label>
        <span>Switch with default style</span>
        <ReactSwitch
          onChange={handleChange}
          checked={checked}
          className="react-switch"
          aria-label="super secret label that is not visible"
        />
      </label>
      <p>
        The switch is <span>{checked ? 'on' : 'off'}</span>.
      </p>
    </div>
  );
};

ReactDOM.render(
  <div>
    <BasicHooksExample />{' '}
  </div>,
  document.getElementById('root')
);
