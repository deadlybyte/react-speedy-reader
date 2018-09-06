import React from 'react';
import { render } from 'react-dom';
import SpeedyReader from 'react-speedy-reader'; // eslint-disable-line

render(
  (
    <div className="demo">
      <SpeedyReader
        autoPlay
        inputText={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
          + 'Fusce dignissim urna turpis, sed interdum massa tincidunt eget. '
          + 'Duis leo nisl, eleifend ac turpis vitae, cursus sagittis leo. '
          + 'Nullam sit amet.'}
        wordChunk={1}
      />
    </div>
  ),
  document.getElementById('app')
);
