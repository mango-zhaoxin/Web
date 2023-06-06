import React, { useEffect, useRef, useState } from "react";
// import { Button } from 'antd';
import './index.less';
// import Icon from 
import { MessageProps } from './interface';

const Message: React.FC<MessageProps> = (props: MessageProps) => {
  const { className, children, type, isIcon, isScroll, isClose } = props;
  const contentRef = useRef<HTMLDivElement>(null);
  console.log(contentRef, 'contentRef--')
  const [duration, setDuration] = useState("");
  const [closeMessageVal, setCloseMessageVal] = useState(true);

  const getClasses = () => {
    return `react-impression-mobile-tag ${type}
    ${className || ""}
    ${isScroll ? 'scroll': ''}
    `;
  };

  // console.log(isScroll, 'isScroll value')

  // useEffect(() => {
  //   if (isScroll) {
  //     const dom = contentRef.current;
  //     if(dom) {
  //       const { width } = dom.getBoundingClientRect();
  //       console.log(width, 'width value')
  //       setDuration(6 + 's')
  //     }
  //   }
  // }, [children, isScroll])

  useEffect(() => {
      const dom = contentRef.current;
      if(dom) {
        const { width } = dom.getBoundingClientRect();
        console.log(width, 'width value')
        setDuration(6 + 's')
      }
  }, [children])

  // 滚动
  // 1. 先去判断要不要去做滚动
  // 2. 怎么去写这个动画
  // isScroll && useEffect(() => {
  //   const dom = contentRef.current;
  //   if(dom) {
  //     const { width } = dom.getBoundingClientRect();
  //     setDuration(6 + 's')
  //   }
  // }, [children])

  const closeMessage = () => {
    setCloseMessageVal(!closeMessageVal)
  }
  
  return (
    <div
      className={getClasses()}
      style={{ display: closeMessageVal ? 'block' : 'none' }}
    >
      <div 
        className="textContent" 
        ref={contentRef} 
        style={{
          animationDuration: duration, 
          animationDelay: duration ? `0s, ${duration}` : ''}
        }>
         {/* {isIcon && (
          <Icon 
          type="exclamation-circle-o"
          className="exclamation-circle-o-icon"
          />
        )} */}
        {/* <Button>hello</Button> */}
        {children}
        {/* {isClose && (
          <div className="close" onClick={closeMessage}>
            <Icon type="times" / >
          </div>
        )} */}
      </div>
    </div>
  )
}

Message.defaultProps = {
  type: 'primary',
  isIcon: false,
  isScroll: false,
  isClose: false,
}

export default Message;