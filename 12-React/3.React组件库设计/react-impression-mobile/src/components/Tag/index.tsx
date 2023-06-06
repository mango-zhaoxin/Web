import React from 'react';
import './index.less';
import { TagProps } from './interface';

const Tag: React.FC<TagProps> = (props: TagProps) => {
  const { className, children, type, isRound, isPlain } = props;
  
  const getClasses = () => { // 处理class类名的函数
    return `react-impression-mobile-tag ${isPlain ? 'plain' : ''} ${type}
    ${isRound ? 'round' : ''}
    ${className || ''}
    `
  }

  return <div className={getClasses()}>{children}</div>
}

Tag.defaultProps = {
  type: 'primary',
  isRound: false,
}

export default Tag;