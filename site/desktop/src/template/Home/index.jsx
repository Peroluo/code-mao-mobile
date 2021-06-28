/* eslint-disable react/no-danger */
import 'react-github-button/assets/style.css';
import React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'bisheng/router';
import { Popover, Button, Row, Col } from 'antd';

function getStyle() {
  return `
    .main-wrapper {
      padding: 0;
    }
    #header {
      box-shadow: none;
      width: 100%;
    }
    #header,
    #header .ant-select-selection,
    #header .ant-menu {
      background: transparent;
    }
  `;
}

class Home extends React.Component {
  render() {
    const addSeparater = (str) => {
      const arr = str.split('|');
      // arr.splice(1, 0 <span>|</span>)
      return [arr[0], <span key="divider" className="divider" />, arr[1]];
    };

    return (
      <DocumentTitle title={'Lbk Components - 录播课组件库'}>
        <div className="main-wrapper">
          <section className="home-s1">
            <div className="banner-wrapper">
              <div className="banner-text-wrapper">
                <h2 key="h2">Lbk Components</h2>
                <p>一个基于 React / Preact 的 UI 组件库</p>
                <div key="button1" className="start-button">
                  <Link to={'/docs/react/introduce'}>
                    <Button type="primary" size="large">
                        开始探索
                    </Button>
                  </Link>
                  <Popover
                    placement="bottom"
                    trigger="click"
                    content={
                      <img className="home-qr" src="https://zos.alipayobjects.com/rmsportal/TrdkqxQcrAUcmYelQUNK.png" alt="qrcode" />
                    }
                  >
                    <Button type="primary" ghost>
                      扫码演示
                    </Button>
                  </Popover>
                </div>
              </div>
            </div>
          </section>
          <section className="home-s2">
            <div className="wrapper">
              <h3>懂你所需</h3>
              <Row gutter={72} style={{ marginBottom: 80 }}>
                <Col span={12}>
                  <img src="https://gw.alipayobjects.com/zos/rmsportal/KUmyjoMxFFbjEdjiIWOw.png" alt="" />
                  <div className="des">
                    <div>{addSeparater('组件丰富 | 功能全面')}</div>
                    <p>提供了 40+ 基础组件、覆盖各类场景，组件特性丰富、满足各种功能需求。</p>
                  </div>
                </Col>
                <Col span={12}>
                  <img src="https://gw.alipayobjects.com/zos/rmsportal/hfFgCpcxpGjeAlXFFgyT.png" alt="" />
                  <div className="des">
                    <div>{addSeparater('一步上手 | 按需加载')}</div>
                    <p>上手足够简单，既可以一次加载所有代码、也可以只加载用到的某几个组件的代码、避免冗余。</p>
                  </div>
                </Col>
              </Row>
              <Row gutter={48}>
                <Col span={12}>
                  <img src="https://gw.alipayobjects.com/zos/rmsportal/nlUNcWIVLKoarLnWNaWS.png" alt="" />
                  <div className="des">
                    <div>{addSeparater('体积小巧 | 性能出众')}</div>
                    <p>在不损失功能的基础上，尽量保证了单个组件的体积最小、性能最优。</p>
                  </div>
                </Col>
                <Col span={12}>
                  <img src="https://gw.alipayobjects.com/zos/rmsportal/JjNULDGGwgOZmsZAqvjH.png" alt="" />
                  <div className="des">
                    <div>简易定制 | 多种风格</div>
                    <p>支持灵活的样式定制，简易生成多种风格，满足个性化产品需求。</p>
                  </div>
                </Col>
              </Row>
            </div>
          </section>
          <style dangerouslySetInnerHTML={{ __html: getStyle() }} />
        </div>
      </DocumentTitle>
    );
  }
}

export default Home;
