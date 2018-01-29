import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const MILLISECONDS_IN_MINUTE = 60000;
export const WHITESPACE_SEPARATOR = ' ';

/**
 * Text streaming component for React
 * @class
 */
class SpeedyReader extends Component {
  /**
   * Component's default props
   * @type {object}
   * @property {boolean} autoPlay=false Default for when the autoPlay property hasn't been set
   * @property {Function} onFinish=undefined Default for when the onFinish property hasn't been set
   * @property {number} speed=250 Default for when the speed property hasn't been set
   * @property {number} wordChunk=1 Default for when the wordChunk hasn't been set
   */
  static defaultProps = {
    autoPlay: false,
    onFinish: undefined,
    speed: 250,
    wordChunk: 1,
  };

  /**
   * Component's prop types
   * @type {object}
   * @property {PropTypes.Requireable<any>} autoPlay Indicates whether the reader starts immediately
   * @property {PropTypes.Validator<any>} inputText Input text to be sped read
   * @property {PropTypes.Requireable<any>} onFinish Callback used when finished reading passage
   * @property {PropTypes.Requireable<any>} speed The speed of the reader in words per minute (WPM)
   * @property {PropTypes.Requireable<any>} wordChunk The number of words to be display per update
   */
  static propTypes = {
    autoPlay: PropTypes.bool,
    inputText: PropTypes.string.isRequired,
    onFinish: PropTypes.func,
    speed: PropTypes.number,
    wordChunk: PropTypes.number,
  };

  /**
   * constructor
   * @param {object} props The properties for the component
   */
  constructor(props) {
    super(props);

    /**
     * Internal state for the component
     * @type {object}
     * @property {number} currentPosition The current position for the reader within the input text
     * @property {string} currentText The current text to be displayed to the user
     * @property {boolean} isPlaying Indicates whether the reader is playing the words
     * @property {string} words All the words contained with the passage of text
     */
    this.state = this.getInitialState();
    /**
     * The timer instance id
     * @type {number}
     */
    this.timer = null;
  }

  /**
   * Returns the initial state
   * @returns {object} Returns the initial state for the speedy reader instance
   * @private
   */
  getInitialState() {
    const { autoPlay, inputText } = this.props;
    const words = this.getWords(inputText);

    return {
      currentPosition: 0,
      currentText: '',
      isPlaying: autoPlay,
      words,
    };
  }

  componentDidMount() {
    const { autoPlay } = this.props;
    if (autoPlay) {
      this.play();
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  /**
   * Returns the words in the sentence, filtering out empty strings
   * @param {string} sentence - The sentence containing the words
   * @returns {string[]} Returns the list of words within a sentence
   * @private
   */
  getWords(sentence) {
    if (!sentence) {
      return [];
    }

    return sentence.split(/\s+/g).filter(Boolean);
  }

  /**
   * Pauses playing of the words for the speed reading
   * @returns {void}
   */
  pause() {
    this.setState({
      isPlaying: false,
    });
    this.update();
  }

  /**
   * Resumes playing of the words for the speed reading
   * @returns {void}
   */
  play() {
    this.setState({
      isPlaying: true,
    });
    this.update();
  }

  /**
   * Resets the speedy reader to the initial state
   * @returns {void}
   */
  reset() {
    this.setState({
      ...this.getInitialState(),
      isPlaying: true,
    });
    this.update();
  }

  /**
   * Updates the speedy reader state with the current text to be displayed to the user
   * @returns {void}
   * @private
   */
  update() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    const { isPlaying } = this.state;
    if (!isPlaying) {
      return;
    }

    const { speed, wordChunk, onFinish } = this.props;
    const timeout = MILLISECONDS_IN_MINUTE / speed;
    this.timer = setTimeout(() => {
      let { currentPosition } = this.state;
      const { words } = this.state;
      const numberOfWords = words.length;

      // move current position forward
      currentPosition += wordChunk;

      // recalculate start position and words to be read
      let currentStartPosition = wordChunk >= (numberOfWords - 1) ?
        0 : (currentPosition - wordChunk);

      const currentTextWords = words.slice(currentStartPosition, currentPosition);

      const currentText = currentTextWords.join(WHITESPACE_SEPARATOR);

      this.setState({
        currentPosition,
        currentText,
      });

      currentStartPosition += wordChunk;

      if (currentStartPosition < numberOfWords) {
        this.update();
      } else if (onFinish) {
        onFinish();
      }
    }, timeout);
  }

  /**
   * Renders the Speedy Reader component
   * @return {ReactElement} Renders the Speedy Reader markup
   */
  render() {
    const { currentText } = this.state;

    if (!currentText) {
      return <span>&nbsp;</span>;
    }

    return <span>{currentText}</span>;
  }
}

export default SpeedyReader;
