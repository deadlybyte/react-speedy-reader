# React Speedy Reader

Speed reader component for React, which streams the text in chunks. Enabling the user to read long passages of text with ease.

## Getting Started

### Prerequisites

* [Node.js v7.6+](https://nodejs.org)

### Installing

```
npm install --save react-speedy-reader
```

or

```
yarn add react-speedy-reader
```

## Usage

```jsx
import React from 'react';
import { render } from 'react-dom';
import SpeedyReader from 'react-speedy-reader';

render(
  (
    <div className="demo">
      <SpeedyReader
        autoPlay
        inputText={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
          'Fusce dignissim urna turpis, sed interdum massa tincidunt eget. ' +
          'Duis leo nisl, eleifend ac turpis vitae, cursus sagittis leo. ' +
          'Nullam sit amet.'}
      />
    </div>
  ),
  document.getElementById('app')
);
```

## Props

### SpeedyReader

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| autoPlay | bool | false | false | Indicates whether the reader starts immediately |
| inputText | string | | true | Input text to be sped read |
| onFinish | function | undefined | false | Callback used when finished reading passage |
| speed | number | 250 | false | The speed of the reader in words per minute (WPM) |
| wordChunk | number | 1 | false | The number of words to be displayed per update |

## Methods

### play()

Pauses playing of the words for the speed reading.

### pause()

Resumes playing of the words for the speed reading.

### reset()

Resets the speedy reader to the initial state.

## Documentation

Please read JSDocs for more information.

## Built With

* [React](https://reactjs.org/docs/) - A JavaScript library for building user interfaces

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/deadlybyte/react-speedy-reader/tags).

## Authors

* **Carl Saunders** - *Initial work* - [DeadlyByte](https://github.com/deadlybyte)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
