import React, { Component, PropTypes } from 'react';
import { View, Dimensions, NativeMethodsMixin } from 'react-native';

class InViewPort extends Component {
  mixins: [NativeMethodsMixin]

  constructor() {
    this.state = {
      rectTop: 0,
      rectBottom: 0
    };
  }

  componentDidMount() {
    if (this.props.active) {
      this.startWatching();
    }
  }

  componentWillUnmount() {
    this.stopWatching();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      this.lastValue = null;
      this.startWatching();
    } else {
      this.stopWatching();
    }
  }

  startWatching() {
    if (this.interval) { return; }
    this.interval = setInterval(this.check, this.props.delay);
  }

  stopWatching() {
    this.interval = clearInterval(this.interval);
  }

  // Check if the element is within the visible viewport
  check() {
    const el = this.refs.myview,
          rect = el.measure((ox, oy, width, height, pageX, pageY) => {
            this.setState({
              rectTop: pageY,
              rectBottom: pageY + height,
              rectWidth: pageX + width,
            })
          });

    const isVisible = (
      this.state.rectBottom != 0 && this.state.rectTop >= 0 && this.state.rectBottom <= window.height &&
      this.state.rectWidth > 0 && this.state.rectWidth <= window.width
    );

    // notify the parent when the value changes
    if (this.lastValue !== isVisible) {
      this.lastValue = isVisible;
      this.props.onChange(isVisible);
    }
  }

  render() {
    return (
      <View ref='myview' {...this.props}>
        {this.props.children}
      </View>
    );
  }
}

InViewPort.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  active: React.PropTypes.bool,
  delay: React.PropTypes.number
};

InViewPort.defaultProps = {
  active: true,
  delay: 100
};

export default InViewPort;
