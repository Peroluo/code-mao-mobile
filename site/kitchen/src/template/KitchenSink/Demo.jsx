/* eslint react/no-danger: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import WhiteSpace from 'code-mao-mobile/lib/white-space';
import 'code-mao-mobile/lib/white-space/style';
import Button from 'code-mao-mobile/lib/button';
import 'code-mao-mobile/lib/button/style';
import WingBlank from 'code-mao-mobile/lib/wing-blank';
import 'code-mao-mobile/lib/wing-blank/style';
import NoticeBar from 'code-mao-mobile/lib/notice-bar';
import 'code-mao-mobile/lib/notice-bar/style';
import collect from 'bisheng/collect';

@collect(async (nextProps) => {
  const { pathname } = nextProps.location;
  const pageDataPath = pathname.split('/');
  const pageData = nextProps.utils.get(nextProps.data, pageDataPath);
  if (!pageData) {
    throw 404; // eslint-disable-line no-throw-literal
  }
  const pageDataPromise = typeof pageData === 'function' ?
    pageData() : (pageData.index)();
  const demosFetcher = nextProps.utils.get(nextProps.data, ['components', nextProps.params.component, 'demo']);
  if (demosFetcher) {
    const [localizedPageData, demos] = await Promise.all([pageDataPromise, demosFetcher()]);
    return { localizedPageData, demos };
  }

  return { localizedPageData: await pageDataPromise };
})

class Demo extends React.Component {
  goToPage = (name, index) => () => {
    window.location.hash = `${name}-demo-${index}`;
  }
  update = () => {
    this.forceUpdate();
  }
  componentDidMount() {
    window.addEventListener('hashchange', this.update, false);
  }
  componentWillUnmount() {
    window.removeEventListener('hashChange', this.update, false);
  }
  render() {
    const {
      demos, location, picked, themeConfig: config,
    } = this.props;
    let demoMeta;
    const name = this.props.params.component;
    picked.components.forEach((i) => {
      const { meta } = i;
      if (meta.filename.split('/')[1] === name) {
        demoMeta = meta;
      }
    });
    const demoArr = [];
    let demoContent;
    Object.keys(demos).forEach((k) => {
      demoArr.push(demos[k]);
    });
    let demoSort = demoArr.sort((a, b) => (
      parseInt(a.meta.order, 10) - parseInt(b.meta.order, 10)
    ));


    const hashArr = location.hash.split(config.hashSpliter);
    const order = hashArr[1] && parseInt(hashArr[1], 10);
    if (location.hash && config.indexDemos.concat(config.subListDemos).indexOf(name) > -1) {
      // 处理 config.indexDemos 里的组件 demo ，使其能只展示一个
      demoSort = demoSort.filter(i => parseInt(i.meta.order, 10) === order);
    }
    if (!location.hash && config.subListDemos.indexOf(name) > -1) {
      // 处理 config.subListDemos 的 demo，使其展示一个二级菜单
      demoContent = demoSort.map((item, index) => (
        <div key={`sub${index}`}>
          <WhiteSpace />
          <WingBlank>
            <Button onClick={this.goToPage(name, index)}>{item.meta.title}</Button>
          </WingBlank>
        </div>
      ));
    } else {
      demoContent = demoSort.map((i, index) => (
        <div className="demo-preview-item" id={`${name}-demo-${i.meta.order}`} key={index}>
          <div className="demoTitle">{i.meta.title}</div>
          <div className="demoContainer">{i.preview(React, ReactDOM)}</div>
          {i.style ? <style dangerouslySetInnerHTML={{ __html: i.style }} /> : null}
        </div>
      ));
    }
    // document.documentElement.clientHeight to
    // remove height of toolbars, address bars and navigation (android)
    const style = {};
    let touchNoticeText = '';
    if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
      style.minHeight = document.documentElement.clientHeight;
    } else if (/(tabs|swipe-action|pull-to-refresh)/i.test(window.location.hash.toLowerCase())) {
      touchNoticeText = '该组件只支持Touch事件，请使用移动模式/设备打开此页。';
    }

    const isLocalMode = window.location.port;
    const linkUrl = isLocalMode ? '' : 'kitchen-sink/';

    return (
      <div id={name} style={style} className="demo">
        <div className="demoName">
          <a className="icon" href={`/${linkUrl}${window.location.search}`} />
          {demoMeta.title}
          <span className="ch">{demoMeta.subtitle}</span>
        </div>
        {
          touchNoticeText &&
          <NoticeBar mode="closable" marqueeProps={{ loop: true }} icon={null}>{touchNoticeText}</NoticeBar>
        }
        {demoContent}
      </div>
    );
  }
}
export default Demo;
