import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { BackTop, Tooltip } from 'antd';
import Header from './Header';

if (typeof window !== 'undefined') {
  /* eslint-disable global-require */
  require('../../static/style');

  // Expose to iframe
  window.react = React;
  window['react-dom'] = ReactDOM;
}


export default class Layout extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      isFirstScreen: true,
    };
  }

  componentDidMount() {
    if (typeof window.ga !== 'undefined') {
      this.context.router.listen((loc) => {
        window.ga('send', 'pageview', loc.pathname + loc.search);
      });
    }

    const nprogressHiddenStyle = document.getElementById('nprogress-style');
    if (nprogressHiddenStyle) {
      this.timer = setTimeout(() => {
        nprogressHiddenStyle.parentNode.removeChild(nprogressHiddenStyle);
      }, 0);
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  onEnterChange = (mode) => {
    this.setState({
      isFirstScreen: mode === 'enter',
    });
  }

  render() {
    const { children, ...restProps } = this.props;
    const { isFirstScreen } = this.state;
    return (
      <div className="page-wrapper">
        <Header {...restProps} isFirstScreen={isFirstScreen} />
        {cloneElement(children, { isFirstScreen, onEnterChange: this.onEnterChange })}
        <Tooltip title={() => <p><a style={{ color: '#ffc600', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer" href="https://www.yuque.com/yuanfei.gyf/public/dv2z7r">欢迎加入 Ant Design Mobile <span aria-label="Smile" role="img">😊</span>&gt;&gt;</a></p>}>
          <BackTop />
        </Tooltip>
      </div>
    );
  }
}
