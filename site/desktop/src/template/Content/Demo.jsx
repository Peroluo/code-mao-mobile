/* eslint react/no-danger: 0 */
import React from 'react';
import classNames from 'classnames';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Modal, Radio, Tooltip, Icon } from 'antd';
import { ping } from '../../../../utils';

export default class Demo extends React.Component {
  state = {
    fullscreen: false,
    lang: 'es6',
    copied: false,
    sourceCode: '',
    showRiddleButton: false,
  };

  saveAnchor = (anchor) => {
    this.anchor = anchor;
  }

  componentDidMount() {
    const { meta } = this.props;
    if (meta.id === window.location.hash.slice(1)) {
      this.anchor.click();
    }
    this.componentWillReceiveProps(this.props);

    this.pingTimer = ping((status) => {
      if (status !== 'timeout' && status !== 'error') {
        this.setState({
          showRiddleButton: true,
        });
      }
    });
  }

  handleClick = (e) => {
    const {
      togglePreview, index, currentIndex, meta,
    } = this.props;

    if (index !== currentIndex && e.target.className !== 'collapse anticon anticon-circle-o-right' &&
      e.target.className !== 'fullscreen anticon anticon-arrow-salt') {
      togglePreview({
        index,
      });
    }

    window.location.hash = meta.id;
  }

  viewFullscreen = (e) => {
    e.stopPropagation();
    this.setState({
      fullscreen: true,
    });
  }

  handleCancel = () => {
    this.setState({
      fullscreen: false,
    });
  }

  handleCodeCopied = () => {
    this.setState({ copied: true });
  }

  onCopyTooltipVisibleChange = (visible) => {
    if (visible) {
      this.setState({
        copyTooltipVisible: visible,
        copied: false,
      });
      return;
    }
    this.setState({
      copyTooltipVisible: visible,
    });
  }

  handleProgrammingLangChange = (e) => {
    this.setState({ lang: e.target.value });
  }
  /* eslint-disable react/jsx-indent */
  renderDemoCode = (highlightedCode, inModal) => {
    const {
      meta,
      style,
    } = this.props;
    const { lang, sourceCode } = this.state;
    const localizedTitle = meta.title;
    const prefillStyle = `@import 'lbk-common-components@2/dist/lbk-common-components.min.css';\n\n${style || ''}`.replace(new RegExp(`#${meta.id}\\s*`, 'g'), '');

    const js = sourceCode
      .replace(/import\s+\{\s+(.*)\s+\}\s+from\s+'rc-form';/, 'const { $1 } = window["rc-form"];')
      .replace(/import\s+\{\s+(.*)\s+\}\s+from\s+'array-tree-filter';/, 'const { $1 } = window["arrayTreeFilter"];')
      .replace(/import\s+\{\s+(.*)\s+\}\s+from\s+'lbk-common-components-demo-data';/, 'const { $1 } = window["lbk-common-components-demo-data"];')
      .replace(/import\s+\{\s+(.*)\s+\}\s+from\s+'lbk-common-components';/, 'const { $1 } = window["lbk-common-components"];');

    const codepenPrefillConfig = {
      title: `${localizedTitle} - Ant Design Mobile Demo`,
      html: `<div id="container" style="padding: 24px"></div>
              <script>
                var mountNode = document.getElementById('container');
              </script>`,
      js,
      css: prefillStyle,
      editors: '001',
      css_external: 'https://unpkg.com/lbk-common-components@2/dist/lbk-common-components.min.css',
      js_external: [
        'react@16/umd/react.production.min.js',
        'react-dom@16/umd/react-dom.production.min.js',
        'rc-form@1/dist/rc-form.min.js',
        'lbk-common-components@2/dist/lbk-common-components.min.js',
        'array-tree-filter@2',
        'lbk-common-components-demo-data@0.3',
      ]
        .map(url => `https://unpkg.com/${url}`)
        .concat(['https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js'])
        .join(';'),
      js_pre_processor: 'typescript',
    };
    const riddlePrefillConfig = {
      title: `${localizedTitle} - Ant Design Mobile Demo`,
      js: sourceCode.replace('from \'lbk-common-components\'', 'from \'lbk-common-components\''),
      css: prefillStyle.replace('\'lbk-common-components/', '\'lbk-common-components/'),
    };
    return Array.isArray(highlightedCode) ? (
      <div className="highlight">
        <div className="code-box-actions">
          {this.state.showRiddleButton ? (
            <form action="//riddle.alibaba-inc.com/riddles/define" method="POST" target="_blank">
              <input type="hidden" name="data" value={JSON.stringify(riddlePrefillConfig)} />
              <Tooltip title={'在 Riddle 中打开'}>
                <input type="submit" value="Create New Riddle with Prefilled Data" className="code-box-riddle" />
              </Tooltip>
            </form>
          ) : null}
          <form action="https://codepen.io/pen/define" method="POST" target="_blank">
            <input type="hidden" name="data" value={JSON.stringify(codepenPrefillConfig)} />
            <Tooltip title={''}>
              <input type="submit" value="Create New Pen with Prefilled Data" className="code-box-codepen" />
            </Tooltip>
          </form>
          <CopyToClipboard
            text={this.state.sourceCode}
            onCopy={this.handleCodeCopied}
          >
            <Tooltip
              title={`${this.state.copied ? '复制成功' : '复制代码'}`}
              visible={this.state.copyTooltipVisible}
              onVisibleChange={this.onCopyTooltipVisibleChange}
            >
              <span
                className="code-box-code-copy"
                onClick={e => e.stopPropagation()}
              >
                <Icon type={(this.state.copied && this.state.copyTooltipVisible) ? 'check' : 'copy'} />
              </span>
            </Tooltip>
          </CopyToClipboard>
        </div>
        {this.props.utils.toReactComponent(highlightedCode)}
      </div>
    ) : (
      <div className="highlight">
        {inModal && (
          <Radio.Group
            value={lang}
            onChange={this.handleProgrammingLangChange}
          >
            <Radio.Button value="es6">ES2016</Radio.Button>
            <Radio.Button value="ts">TypeScript</Radio.Button>
          </Radio.Group>
        )}
        <pre className="language-jsx">
          <code dangerouslySetInnerHTML={{ __html: highlightedCode[lang] }} />
        </pre>
      </div>
    );
  }
  componentWillReceiveProps(nextProps) {
    const { highlightedCode } = nextProps;
    const div = document.createElement('div');
    div.innerHTML = highlightedCode[1].highlighted;
    this.setState({ sourceCode: div.textContent });
  }

  render() {
    const { props, state } = this;
    const {
      meta,
      content,
      highlightedCode,
      highlightedStyle,
      className,
      utils,
    } = props;

    const codeBoxClass = classNames({
      'code-box': true,
      [className]: className,
    });

    const localizedTitle = meta.title;
    const localizeIntro = content;
    const introChildren = utils.toReactComponent(['div'].concat(localizeIntro));

    const hsNode = highlightedStyle ? (
      <div key="style" className="highlight">
        <pre>
          <code
            className="css"
            dangerouslySetInnerHTML={{
              __html: highlightedStyle,
            }}
          />
        </pre>
      </div>) : null;

    return (
      <section className={codeBoxClass} id={meta.id} onClick={this.handleClick}>
        <Modal
          ref="modal"
          visible={state.fullscreen}
          title={localizedTitle}
          onCancel={this.handleCancel}
          width={900}
          footer={[
            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>返回</Button>,
          ]}
        >
          {this.renderDemoCode(highlightedCode, true)}
          {hsNode}
        </Modal>

        <section className="code-box-meta markdown">
          <div className="code-box-title">
            <a href={`#${meta.id}`} ref={this.saveAnchor}>
              {localizedTitle}
            </a>
          </div>
          {introChildren}
          <span
            className="fullscreen anticon anticon-arrow-salt"
            onClick={this.viewFullscreen}
            unselectable="none"
          />
          {!Array.isArray(highlightedCode) && (
            <Radio.Group
              value={state.lang}
              onChange={this.handleProgrammingLangChange}
            >
              <Radio.Button value="es6">ES2016</Radio.Button>
              <Radio.Button value="ts">TypeScript</Radio.Button>
            </Radio.Group>
          )}
        </section>

        <section
          className="highlight-wrapper"
          key="code"
        >
          {this.renderDemoCode(highlightedCode, false)}
          {hsNode}
        </section>
      </section>
    );
  }
}
