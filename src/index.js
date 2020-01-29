import React from 'react';
import './index.less';

export default ({ name }) => {
  return (
    <div className="test-name">
      <div className="test-content">
      {name}
      </div>
    </div>
  );
}