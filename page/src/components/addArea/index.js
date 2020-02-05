import React, { useState, useEffect, useRef } from 'react';
import './index.less';

const componentWrapDefaultClass = 'component-wrapper';

const getStyle = (dom, attr) => {
  return dom.currentStyle ? dom.currentStyle[attr] : getComputedStyle(dom, false)[attr];
}

// 添加区域组件内容
function AddCom({ handleChangeComponent }) {
  const addDom = useRef(null);
  const [display, setDisplay] = useState('none');
  const commonParam = {
    previewSrc: '', //组件添加真正用到的图片地址
    tempPreviewSrc: '', // 临时存放图片，当该图片有效果时会赋值给previewSrc
    nextComponentIndex: 0
  };

  useEffect(() => {
    const components = document.getElementsByClassName('component-wrapper');
    let originTopAwayArr = Array.prototype.map.call(components, dom => {
      const topAway = dom.getBoundingClientRect().top;
      return topAway;
    });

    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      
      commonParam.previewSrc = commonParam.tempPreviewSrc;

      const pageY = e.pageY;
      Array.prototype.forEach.call(components, (dom, index) => {
        const paddingTop = Number(getStyle(dom, 'padding').split(' ')[0].split('px')[0]);
        const height = dom.clientHeight;
        const contentHeight = height - paddingTop;
        const topAway = dom.offsetTop;
        const middleAway = contentHeight / 2 + topAway;
        const bottomAway = height + topAway;
        const currentClassName = dom.getAttribute('class');
        const nextDom = components[index + 1];
        const nextClassName = nextDom && nextDom.getAttribute('class');
        // 最后一个元素计算方式不同
        const lastIndex = components.length - 1;
        if (index === lastIndex && pageY >= middleAway && pageY <= bottomAway) {
          Array.prototype.forEach.call(components, item => item.setAttribute('class', componentWrapDefaultClass));
          addDom.current.style.top = `${originTopAwayArr[lastIndex] + contentHeight}px`;
          commonParam.nextComponentIndex = components.length;
          return;
        }
        // 一般情况
        if (pageY >= topAway && pageY <= middleAway && currentClassName === componentWrapDefaultClass) {
          Array.prototype.forEach.call(components, item => item.setAttribute('class', componentWrapDefaultClass));
          addDom.current.style.top = `${originTopAwayArr[index]}px`;
          dom.setAttribute('class', `${currentClassName} component-away`);
          commonParam.nextComponentIndex = index;
        } else if (pageY > middleAway && pageY <= bottomAway && nextClassName === componentWrapDefaultClass) {
          Array.prototype.forEach.call(components, item => item.setAttribute('class', componentWrapDefaultClass));
          addDom.current.style.top = `${originTopAwayArr[index + 1]}px`;
          nextDom.setAttribute('class', `${nextClassName} component-away`);
          commonParam.nextComponentIndex = index + 1;
        }
      });
    });

    document.addEventListener("dragenter", e => {
      setDisplay('block');
      window.parent.window.postMessage('enter');
    });

    document.addEventListener("dragleave", e => {
      if (e.pageX > 0 && e.pageX < 375 && e.pageY > 0) {
        return;
      }

      commonParam.previewSrc = '';
      commonParam.tempPreviewSrc = '';
      const components = document.getElementsByClassName('component-wrapper');
      Array.prototype.forEach.call(components, item => item.setAttribute('class', componentWrapDefaultClass));
      setDisplay('none');
      window.parent.window.postMessage('leave');
    });

    document.addEventListener('drop', e => {
      Array.prototype.forEach.call(components, item => item.setAttribute('class', componentWrapDefaultClass));
      setDisplay('none');

      if (!commonParam.previewSrc || typeof commonParam.previewSrc !== 'string') {
        handleChangeComponent(commonParam.nextComponentIndex);
        return;
      }

      const pageWrapper = document.getElementById('page-wrapper');
      const nextDom = components[commonParam.nextComponentIndex] || null;
      const newDom = new Image();
      newDom.src = commonParam.previewSrc;
      newDom.style.width = '100%';
      pageWrapper.insertBefore(newDom, nextDom);
      window.parent.window.postMessage('construct');

      commonParam.previewSrc = '';
      commonParam.tempPreviewSrc = '';
    })

    window.addEventListener('message', e => {
      if (typeof e.data !== 'string') return;

      const [type, data] = e.data.split(':::');
      if (type === 'previewImage') {
        commonParam.tempPreviewSrc = data;
      }
    })
  }, []);

  return (
    <div
      className="add-wrapper"
      ref={addDom}
      style={{ display }}
    >
      <div className="add-icon">+</div>
      <div className="add-notice">添加到这个位置</div>
    </div>
  );
}

export default AddCom;