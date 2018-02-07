import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import SpeedyReader, { MILLISECONDS_IN_MINUTE } from '../src/SpeedyReader';

describe('SpeedyReader', () => {
  describe('render', () => {
    it('renders without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render(<SpeedyReader inputText="This is a test" speed={250} />, div);
      ReactDOM.unmountComponentAtNode(div);
    });

    it('should render blank when inputText is whitespace', () => {
      const componentUnderTest = renderer.create(<SpeedyReader inputText="" speed={1} />)
        .toJSON();
      expect(componentUnderTest).toMatchSnapshot();
    });

    describe(undefined, () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
      });

      it('should render the first word of the inputText when text is not whitespace and wordChunk is one', () => {
        const componentUnderTest = shallow(<SpeedyReader autoPlay inputText="This is a test" speed={1} />);
        jest.runOnlyPendingTimers();
        componentUnderTest.update();
        expect(componentUnderTest).toMatchSnapshot();
      });

      it('should render the three words of the inputText when text is more than three words in length and wordChunk is three', () => {
        const componentUnderTest = shallow(<SpeedyReader autoPlay inputText="This is a test" speed={1} wordChunk={3} />);
        jest.runOnlyPendingTimers();
        componentUnderTest.update();
        expect(componentUnderTest).toMatchSnapshot();
      });

      it('should render all the words of the inputText when wordChunk is greater than number of words', () => {
        const componentUnderTest = shallow(<SpeedyReader autoPlay inputText="This is a test" speed={1} wordChunk={6} />);
        jest.runOnlyPendingTimers();
        componentUnderTest.update();
        expect(componentUnderTest).toMatchSnapshot();
      });
    });
  });

  describe('componentDidMount', () => {
    describe('autoPlay', () => {
      let updateSpy;

      beforeEach(() => {
        updateSpy = jest.spyOn(SpeedyReader.prototype, 'update');
      });

      afterEach(() => {
        updateSpy.mockClear();
      });

      it('should call update when autoPlay is true and component is mounted', () => {
        const componentUnderTest = shallow(<SpeedyReader autoPlay inputText="This is a test" speed={1} wordChunk={6} />);

        expect(componentUnderTest.state('isPlaying')).toBeTruthy();
        expect(updateSpy).toHaveBeenCalled();
      });

      it('should not call update when autoPlay is false and component is mounted', () => {
        const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} wordChunk={6} />);

        expect(componentUnderTest.state('isPlaying')).toBeFalsy();
        expect(updateSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('componentWillReceiveProps', () => {
    let updateSpy;

    beforeEach(() => {
      updateSpy = jest.spyOn(SpeedyReader.prototype, 'update');
    });

    afterEach(() => {
      updateSpy.mockClear();
    });

    describe('speed', () => {
      it('should call update if the speed has changed and is playing', () => {
        const componentUnderTest = shallow(<SpeedyReader autoPlay inputText="This is a test" speed={1} />);

        componentUnderTest.setProps({
          speed: 2,
        });

        expect(updateSpy).toHaveBeenCalledTimes(2);
      });

      it('should not call update if the speed prop has not changed', () => {
        const componentUnderTest = shallow(<SpeedyReader autoPlay inputText="This is a test" speed={1} />);

        componentUnderTest.setProps({
          speed: 1,
        });

        expect(updateSpy).toHaveBeenCalledTimes(1);
      });

      it('should not call update if the speed prop changes and current not playing', () => {
        const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);

        componentUnderTest.setProps({
          speed: 2,
        });

        expect(updateSpy).toHaveBeenCalledTimes(0);
      });
    });

    describe('wordChunk', () => {
      it('should call update if the wordChunk has changed and is playing', () => {
        const componentUnderTest = shallow(<SpeedyReader autoPlay inputText="This is a test" speed={1} wordChunk={1} />);

        componentUnderTest.setProps({
          wordChunk: 2,
        });

        expect(updateSpy).toHaveBeenCalledTimes(2);
      });

      it('should not call update if the wordChunk prop has not changed', () => {
        const componentUnderTest = shallow(<SpeedyReader autoPlay inputText="This is a test" speed={1} wordChunk={1} />);

        componentUnderTest.setProps({
          wordChunk: 1,
        });

        expect(updateSpy).toHaveBeenCalledTimes(1);
      });

      it('should not call update if the wordChunk prop changes and current not playing', () => {
        const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} wordChunk={1} />);

        componentUnderTest.setProps({
          wordChunk: 2,
        });

        expect(updateSpy).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('componentWillUnmount', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.clearAllTimers();
      jest.useRealTimers();
    });

    it('should clear the timer when component is unmount and timer has been used', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay inputText="This is a test" speed={1} />);

      componentUnderTest.unmount();

      expect(clearTimeout).toHaveBeenCalled();
    });

    it('should not clear the timer when component is unmount and timer has not been used', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);

      componentUnderTest.unmount();

      expect(clearTimeout).not.toHaveBeenCalled();
    });
  });

  describe('pause', () => {
    let updateSpy;

    beforeEach(() => {
      updateSpy = jest.spyOn(SpeedyReader.prototype, 'update');
    });

    afterEach(() => {
      updateSpy.mockClear();
    });

    it('should set state isPlaying to false', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);

      componentUnderTest.setState({ isPlaying: true });
      componentUnderTest.instance().pause();
      expect(componentUnderTest.state('isPlaying')).toBeFalsy();
    });

    it('should call update', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);

      componentUnderTest.instance().pause();

      expect(updateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('play', () => {
    let updateSpy;

    beforeEach(() => {
      updateSpy = jest.spyOn(SpeedyReader.prototype, 'update');
    });

    afterEach(() => {
      updateSpy.mockClear();
    });

    it('should set state isPlaying to true', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} isPlaying={false} inputText="This is a test" speed={1} />);

      componentUnderTest.instance().play();
      expect(componentUnderTest.state('isPlaying')).toBeTruthy();
    });

    it('should call update', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} isPlaying inputText="This is a test" speed={1} />);

      componentUnderTest.instance().play();
      expect(updateSpy).toBeCalled();
    });
  });

  describe('reset', () => {
    let getInitialStateSpy;
    let updateSpy;

    beforeEach(() => {
      getInitialStateSpy = jest.spyOn(SpeedyReader.prototype, 'getInitialState');
      updateSpy = jest.spyOn(SpeedyReader.prototype, 'update');
    });

    afterEach(() => {
      getInitialStateSpy.mockClear();
      updateSpy.mockClear();
    });

    it('should reset the reader and restore back to initial state and start playing', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} isPlaying inputText="This is a test" speed={1} />);

      componentUnderTest.instance().reset();
      expect(getInitialStateSpy).toHaveBeenCalled();
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 0,
        currentText: '',
        isPlaying: true,
        words: ['This', 'is', 'a', 'test'],
      });
      expect(updateSpy).toBeCalled();
    });

    it('should reset the reader and restore back to initial state and auto play', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} isPlaying inputText="This is a test" speed={1} />);

      componentUnderTest.instance().reset(true);
      expect(getInitialStateSpy).toHaveBeenCalled();
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 0,
        currentText: '',
        isPlaying: true,
        words: ['This', 'is', 'a', 'test'],
      });
      expect(updateSpy).toBeCalled();
    });

    it('should reset the reader and restore back to initial state and not auto play', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} isPlaying inputText="This is a test" speed={1} />);

      componentUnderTest.instance().reset(false);
      expect(getInitialStateSpy).toHaveBeenCalled();
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 0,
        currentText: '',
        isPlaying: false,
        words: ['This', 'is', 'a', 'test'],
      });
      expect(updateSpy).toBeCalled();
    });
  });

  describe('update', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.clearAllTimers();
      jest.useRealTimers();
    });

    it('should clearTimeout if already been set', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay inputText="This is a test" speed={1} />);
      componentUnderTest.instance().update();

      expect(clearTimeout).toHaveBeenCalled();
    });

    it('should not clearTimeout if first time called and no timers have been defined', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);
      componentUnderTest.instance().update();
      expect(clearTimeout).not.toHaveBeenCalled();
    });

    it('should call setTimeout with the correct timeout interval when speed is set to one word per minute', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);
      componentUnderTest.setState({ isPlaying: true });
      componentUnderTest.instance().update();
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 60000);
    });

    it('should call setTimeout with the correct timeout interval when speed is set to five words per minute', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={5} />);
      componentUnderTest.setState({ isPlaying: true });
      componentUnderTest.instance().update();
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 12000);
    });

    it('should ignore setTimeout when reader is paused', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);
      componentUnderTest.setState({ isPlaying: false });
      componentUnderTest.instance().update();
      expect(setTimeout).not.toHaveBeenCalled();
    });

    it('should update state when timeout elapsed', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);
      componentUnderTest.setState({ isPlaying: true });
      componentUnderTest.instance().update();

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 0,
        currentText: '',
        isPlaying: true,
        words: ['This', 'is', 'a', 'test'],
      });
      jest.runOnlyPendingTimers();
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 1,
        currentText: 'This',
        isPlaying: true,
        words: ['This', 'is', 'a', 'test'],
      });
      expect(setTimeout).toHaveBeenCalledTimes(2);
    });

    it('should move to the next word chunk when timeout elapsed', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);
      componentUnderTest.setState({ isPlaying: true });
      componentUnderTest.instance().update();

      const updateSpy = jest.spyOn(SpeedyReader.prototype, 'update');

      expect(updateSpy).toBeCalled();
      expect(setTimeout).toHaveBeenCalledTimes(1);
      jest.runOnlyPendingTimers();
      expect(setTimeout).toHaveBeenCalledTimes(2);
      jest.runOnlyPendingTimers();
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 2,
        currentText: 'is',
        isPlaying: true,
        words: ['This', 'is', 'a', 'test'],
      });
      expect(setTimeout).toHaveBeenCalledTimes(3);
      updateSpy.mockClear();
    });

    it('should pause speed reading when user pauses', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);
      componentUnderTest.setState({ isPlaying: true });
      componentUnderTest.instance().update();
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 0,
        currentText: '',
        isPlaying: true,
        words: ['This', 'is', 'a', 'test'],
      });

      jest.runOnlyPendingTimers();
      expect(setTimeout).toHaveBeenCalledTimes(2);
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 1,
        currentText: 'This',
        isPlaying: true,
        words: ['This', 'is', 'a', 'test'],
      });
      componentUnderTest.setState({ isPlaying: false });
      jest.runOnlyPendingTimers();
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 2,
        currentText: 'is',
        isPlaying: false,
        words: ['This', 'is', 'a', 'test'],
      });
      expect(setTimeout).toHaveBeenCalledTimes(2);
    });

    it('should pause speed reading and resume correctly', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);
      componentUnderTest.setState({ isPlaying: true });
      componentUnderTest.instance().update();
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 0,
        currentText: '',
        isPlaying: true,
        words: ['This', 'is', 'a', 'test'],
      });
      jest.runOnlyPendingTimers();
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 1,
        currentText: 'This',
        isPlaying: true,
        words: ['This', 'is', 'a', 'test'],
      });

      componentUnderTest.setState({ isPlaying: false });
      jest.runOnlyPendingTimers();
      expect(setTimeout).toHaveBeenCalledTimes(2);
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 2,
        currentText: 'is',
        isPlaying: false,
        words: ['This', 'is', 'a', 'test'],
      });

      componentUnderTest.setState({ isPlaying: true });
      componentUnderTest.instance().update();
      expect(setTimeout).toHaveBeenCalledTimes(3);
      jest.runOnlyPendingTimers();
      expect(setTimeout).toHaveBeenCalledTimes(4);
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 3,
        currentText: 'a',
        isPlaying: true,
        words: ['This', 'is', 'a', 'test'],
      });

      jest.runOnlyPendingTimers();
      expect(setTimeout).toHaveBeenCalledTimes(5);
    });

    it('should speed read whole passage', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);
      componentUnderTest.setState({ isPlaying: true });
      componentUnderTest.instance().update();

      const updateSpy = jest.spyOn(SpeedyReader.prototype, 'update');

      expect(updateSpy).toBeCalled();
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 0,
        currentText: '',
        isPlaying: true,
        words: ['This', 'is', 'a', 'test'],
      });
      expect(setTimeout).toHaveBeenCalledTimes(1);

      jest.runOnlyPendingTimers();
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 1,
        currentText: 'This',
        isPlaying: true,
        words: ['This', 'is', 'a', 'test'],
      });
      expect(setTimeout).toHaveBeenCalledTimes(2);
      jest.runOnlyPendingTimers();
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 2,
        currentText: 'is',
        isPlaying: true,
        words: ['This', 'is', 'a', 'test'],
      });

      expect(setTimeout).toHaveBeenCalledTimes(3);
      jest.runOnlyPendingTimers();
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 3,
        currentText: 'a',
        isPlaying: true,
        words: ['This', 'is', 'a', 'test'],
      });

      expect(setTimeout).toHaveBeenCalledTimes(4);
      jest.runOnlyPendingTimers();
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 4,
        currentText: 'test',
        isPlaying: true,
        words: ['This', 'is', 'a', 'test'],
      });

      expect(setTimeout).toHaveBeenCalledTimes(5);
      jest.runOnlyPendingTimers();
      expect(componentUnderTest.state()).toEqual({
        currentPosition: 4,
        currentText: 'test',
        isPlaying: false,
        words: ['This', 'is', 'a', 'test'],
      });

      updateSpy.mockClear();
    });

    describe('onFinished', () => {
      let onFinishSpy;

      beforeEach(() => {
        onFinishSpy = jest.fn();
      });

      afterEach(() => {
        onFinishSpy.mockClear();
      });

      it('should reset state when passage is one word and has been read', () => {
        const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This" speed={1} />);
        componentUnderTest.setState({ isPlaying: true });
        componentUnderTest.instance().update();

        jest.runTimersToTime(2 * MILLISECONDS_IN_MINUTE);
        expect(componentUnderTest.state()).toEqual({
          currentPosition: 1,
          currentText: 'This',
          isPlaying: false,
          words: ['This'],
        });
      });

      it('should call onFinish when passage is one word and has been read', () => {
        const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This" speed={1} onFinish={onFinishSpy} />);
        componentUnderTest.setState({ isPlaying: true });
        componentUnderTest.instance().update();

        jest.runTimersToTime(2 * MILLISECONDS_IN_MINUTE);
        expect(onFinishSpy).toHaveBeenCalled();
      });

      it('should reset state when passage is multiple words and whole passage has been read', () => {
        const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} onFinish={onFinishSpy} />);
        componentUnderTest.setState({ isPlaying: true });
        componentUnderTest.instance().update();

        jest.runTimersToTime(5 * MILLISECONDS_IN_MINUTE);
        expect(componentUnderTest.state()).toEqual({
          currentPosition: 4,
          currentText: 'test',
          isPlaying: false,
          words: ['This', 'is', 'a', 'test'],
        });
      });

      it('should call onFinish when passage is multiple words and whole passage has been read', () => {
        const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} onFinish={onFinishSpy} />);
        componentUnderTest.setState({ isPlaying: true });
        componentUnderTest.instance().update();

        jest.runTimersToTime(5 * MILLISECONDS_IN_MINUTE);
        expect(onFinishSpy).toHaveBeenCalled();
      });
    });
  });

  describe('getInitialState', () => {
    it('should return the initial state', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);

      expect(componentUnderTest.instance().getInitialState()).toEqual({
        currentPosition: 0,
        currentText: '',
        isPlaying: false,
        words: ['This', 'is', 'a', 'test'],
      });
    });

    it('should return the initial state accordingly when wordChunk is set', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} wordChunk={2} />);

      expect(componentUnderTest.instance().getInitialState()).toEqual({
        currentPosition: 0,
        currentText: '',
        isPlaying: false,
        words: ['This', 'is', 'a', 'test'],
      });
    });
  });

  describe('getWords', () => {
    it('should return an empty array when sentence is undefined', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);
      expect(componentUnderTest.instance().getWords(undefined)).toEqual([]);
    });

    it('should return an empty array when sentence is null', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);
      expect(componentUnderTest.instance().getWords(null)).toEqual([]);
    });

    it('should return an empty array when sentence is whitespace', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);
      expect(componentUnderTest.instance().getWords('')).toEqual([]);
    });

    it('should return an array of a single word when sentence is one word', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);
      expect(componentUnderTest.instance().getWords('This')).toEqual(['This']);
    });

    it('should return an array of words when sentence contains multiple words', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);
      expect(componentUnderTest.instance().getWords('This is a test')).toEqual(['This', 'is', 'a', 'test']);
    });

    it('should return an array of words when sentence contains multiple words and duplicate whitespace', () => {
      const componentUnderTest = shallow(<SpeedyReader autoPlay={false} inputText="This is a test" speed={1} />);
      expect(componentUnderTest.instance().getWords('This \nis a  test')).toEqual(['This', 'is', 'a', 'test']);
    });
  });
});
