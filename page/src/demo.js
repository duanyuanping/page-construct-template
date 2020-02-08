import React, { Component, useState, useRef, useE } from 'react';
import AddCom from './components/addArea';
import './demo.less';

// import PageConstructBanner from 'page-construct_banner';
// import ConstructComponentInfocard from 'construct-component-infocard';

const componentName = "component-wrapper";

export default class extends Component {
  pageWrapper = React.createRef()
  state = {
    currentIndex: -1,
    /**
     * [
     *  {
     *    componentClass: *, 组件函数
     *    componentName: *, 组件名
     *    props: *, 组件调用传参
     *  },
     *  ...
     * ]
     */
    components: [
      // {
      //   componentClass: ConstructComponentInfocard,
      //   componentName: 'construct-component-infocard',
      //   props: {"cover":"http://q4wpci6vb.sabkt.gdipper.com/tuhaokuai_1581170927.png","title":"信息卡片title","avatar":"http://pic.url.cn/hy_personal/33febdb83d891b3228a882f40ce341550f94a83e4130e13b3f435b7d0a5548e1/80?tp=webp","anchor":"主播名","fans":10000},
      //   key: Math.random()
      // },
      // {
      //   componentClass: PageConstructBanner,
      //   componentName: 'page-construct_banner',
      //   props: {
      //     list: ["http://q4wpci6vb.sabkt.gdipper.com/tuhaokuai_1581170927.png","http://q4wpci6vb.sabkt.gdipper.com/tuhaokuai_1581170927.png","http://q4wpci6vb.sabkt.gdipper.com/tuhaokuai_1581170927.png"]
      //   },
      //   key: Math.random() * Math.random()
      // }
    ]
  }
  
  componentDidMount() {
    window.addEventListener('message', e => {
      if (typeof e.data !== 'string') return;

      const [type, data] = e.data.split(':::');

      switch(type) {
        case 'componentPropsUpdata':
          this.handleUpdateComponents(data);
          break;
        case 'sendComponents':
          this.handleSendComponentsConfig();
          break;
        default:
          break;
      }
    })
  }

  handleUpdateComponents = data => {
    const { components } = this.state;
    const [key, values] = data.split(';;;');
    const newComponents = components.map(item => {
      if (item.key == key) {
        let props = JSON.parse(values);

        return {
          ...item,
          props
        };
      } else {
        return {
          ...item
        };
      }
    });

    this.setState({
      components: newComponents
    });
  }

  handleSendComponentsConfig = () => {
    const { components } = this.state;

    const infoMap = components.map(item => ({
      name: item.componentName,
      props: item.props,
      key: item.key
    }));

    window.parent.window.postMessage(`pageComponentConfigUpdate:::${JSON.stringify(infoMap)}`);
  }

  handleDragStart = (e, index) => {
    const componentDoms = Array.prototype.filter.call(
      this.pageWrapper.current.childNodes,
      childNode => {
        return !!childNode.getAttribute('name') && !!~childNode.getAttribute('name').indexOf(componentName)
      }
    );
    const target = componentDoms[index];
    const height = target.offsetHeight;
    const width = target.offsetWidth;
    // todo:错误位置信息
    e.dataTransfer.setDragImage(target, width / 2, height / 2);

    setTimeout(() => {
      this.setState({
        currentIndex: index
      });
    })
  }

  handleChangeComponent = (nextIndex) => {
    const { currentIndex, components } = this.state;
    if (currentIndex < 0 || currentIndex > components.length - 1) {
      return;
    }

    let newComponents = [...components];
    if (components[nextIndex]) {
      const currentComponent = newComponents.splice(currentIndex, 1)[0];
      newComponents.splice(nextIndex, 0, currentComponent);
    } else {
      const currentComponent = newComponents.splice(currentIndex, 1)[0];
      newComponents.splice(components.length - 1, 0, currentComponent);
    }

    this.setState({
      components: newComponents,
      currentIndex: -1
    }, () => {
      this.handleSendComponentsConfig();
    });
  }

  handleComponentClick = (name, key, props) => {
    window.parent.window.postMessage(`componentClick:::${name};;;${key};;;${JSON.stringify(props)}`);
  }

  handleConstruct = nextIndex => {
    const { components } = this.state;

    const infoMap = components.map(item => ({
      name: item.componentName,
      props: item.props
    }));

    window.parent.window.postMessage(`pageConstruct:::${JSON.stringify(infoMap)};;;${nextIndex}`);
  }

  render() {
    const { currentIndex, components } = this.state;

    return (
      <div
        id="page-wrapper"
        ref={this.pageWrapper}
      >
        {
          components.map && components.map((item, index) => {
            if (currentIndex !== index) {
              return (
                <div
                  key={item.key}
                  name={componentName}
                  className="component-wrapper"
                  draggable={true}
                  onDragStart={e => this.handleDragStart(e, index)}
                  onClick={() => this.handleComponentClick(item.componentName, item.key, item.props)}
                >
                  <item.componentClass {...item.props} />
                </div>
              )
            } else {
              return ''
            }
          })
        }
        <AddCom
          handleConstruct={this.handleConstruct}
          handleChangeComponent={this.handleChangeComponent}
        />
      </div>
    );
  }
}