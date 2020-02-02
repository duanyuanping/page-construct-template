import React, { Component, useState, useRef, useE } from 'react';
import AddCom from './components/addArea';
import './demo.less';

/** replaceholder: import */

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
     *    key: *, 组件key
     *  },
     *  ...
     * ]
     */
    components: [{/** replaceholder: use development */}]
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
    });
  }

  render() {
    const { currentIndex } = this.state;

    return (
      <div
        id="page-wrapper"
        ref={this.pageWrapper}
      >
        {
          this.state.components.map((item, index) => {
            if (currentIndex !== index) {
              return (
                <div
                  key={item.key}
                  name={componentName}
                  className="component-wrapper"
                  draggable={true}
                  onDragStart={e => this.handleDragStart(e, index)}
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
          handleChangeComponent={this.handleChangeComponent}
        />
      </div>
    );
  }
}