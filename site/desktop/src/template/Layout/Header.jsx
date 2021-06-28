import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'bisheng/router';
import classNames from 'classnames';
import { Menu, Row, Col, Icon, AutoComplete, Input, Popover } from 'antd';
import _config from '../../../../config';

const { Option } = AutoComplete;

export default class Header extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  state = {
    inputValue: '',
    menuVisible: false,
    menuMode: 'horizontal',
  };

  componentDidMount() {
    // this.context.router.listen(this.handleHideMenu);
    const { searchInput } = this;
    /* eslint-disable global-require */
    require('enquire.js')
      .register('only screen and (min-width: 0) and (max-width: 992px)', {
        match: () => {
          this.setState({ menuMode: 'inline' });
        },
        unmatch: () => {
          this.setState({ menuMode: 'horizontal' });
        },
      });
    document.addEventListener('keyup', (event) => {
      if (event.keyCode === 83 && event.target === document.body) {
        searchInput.focus();
      }
    });
    /* eslint-enable global-require */
  }

  handleMenuIconClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.setState({
      menuVisible: true,
    });
  }

  handleSearch = (value) => {
    const { router } = this.context;
    this.setState({
      inputValue: '',
    }, () => {
      router.push({ pathname: `${value}/` });
      this.searchInput.blur();
    });
  }

  handleInputChange = (value) => {
    this.setState({
      inputValue: value,
    });
  }
  handleSelectFilter = (value, option) => {
    const optionValue = option.props['data-label'];
    return optionValue.indexOf(value.toLowerCase()) > -1;
  }

  render() {
    const { inputValue, menuMode, menuVisible } = this.state;
    const { location, picked, isFirstScreen } = this.props;
    const { components } = picked;
    const module = location.pathname.replace(/(^\/|\/$)/g, '').split('/').slice(0, -1).join('/');

    let activeMenuItem = module || 'home';

    if (activeMenuItem === 'components' || location.pathname === 'changelog') {
      activeMenuItem = 'docs/react';
    }

    const options = components
      .map(({ meta }) => {
        const pathSnippet = meta.filename.split('/')[1];
        const url = `/components/${pathSnippet}`;
        const { subtitle } = meta;
        return (
          <Option value={url} key={url} data-label={`${(meta.title || meta.english).toLowerCase()} ${meta.subtitle || meta.chinese}`}>
            <strong>{meta.title || meta.english}</strong>
            {subtitle && <span className="ant-component-decs">{meta.subtitle || meta.chinese}</span>}
          </Option>
        );
      });

    const headerClassName = classNames({
      clearfix: true,
      'home-nav-white': !isFirstScreen,
      'home-page-header': activeMenuItem === 'home',
    });

    const menu = [
      <Menu className="menu-site" mode={menuMode} selectedKeys={[activeMenuItem]} id="nav" key="nav">
        <Menu.Item key="home">
          <Link to={'/'}>
            首页
          </Link>
        </Menu.Item>
        <Menu.Item key="docs/react">
          <Link to={'/docs/react/introduce'}>
            组件
          </Link>
        </Menu.Item>
      </Menu>,
    ];

    const searchPlaceholder = '搜索组件...';
    return (
      <header id="header" className={headerClassName}>
        {menuMode === 'inline' ? (
          <Popover
            overlayClassName="popover-menu"
            placement="bottomRight"
            content={menu}
            trigger="click"
            visible={menuVisible}
            arrowPointAtCenter
            onVisibleChange={this.onMenuVisibleChange}
          >
            <Icon
              className="nav-phone-icon"
              type="menu"
              onClick={this.handleShowMenu}
            />
          </Popover>
        ) : null}
        <Row>
          <Col xxl={4} xl={5} lg={5} md={8} sm={24} xs={24}>
            <Link to={'/'} id="logo">
              <img alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
              <span>{_config.title}</span>
            </Link>
          </Col>
          <Col xxl={20} xl={19} lg={19} md={16} sm={0} xs={0}>
            <div id="search-box">
              <Icon type="search" />
              <AutoComplete
                dataSource={options}
                value={inputValue}
                dropdownClassName="component-select"
                placeholder={searchPlaceholder}
                optionLabelProp="data-label"
                filterOption={this.handleSelectFilter}
                onSelect={this.handleSearch}
                onSearch={this.handleInputChange}
                getPopupContainer={trigger => trigger.parentNode}
              >
                <Input ref={ref => this.searchInput = ref} />
              </AutoComplete>
            </div>
            {menuMode === 'horizontal' ? menu : null}
          </Col>
        </Row>
      </header>
    );
  }
}
