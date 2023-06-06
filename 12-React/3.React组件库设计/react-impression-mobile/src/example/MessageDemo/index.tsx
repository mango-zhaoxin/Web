import * as React from 'react';
import Message from '../../components/Message';
import './index.less';

const PaginationDemo: React.FC = () => {
  return (
    <div className="box">
      <div className="card-size">
        <h3>纯文本</h3>
        <Message>示例文案，这是一段示例文案用来参考，示例文案展示。</Message>
      </div>
      <div className="card-size">
        <h3>文本+图标</h3>
        <Message>示例文案，这是一段示例文案用来参考，示例文案展示。</Message>
      </div>
      <div className="card-size">
        <h3>双排文本</h3>
        <Message isIcon>示例文案，这是一段示例文案用来参考，示例文案展示。示例文案，这是一段示例文案用来参考</Message>
      </div>
      <div className="card-size">
        <h3>文案滚动</h3>
        <Message isIcon isScroll={true}>
          示例文案，这是一段示例文案用来参考，示例文案展示。
        </Message>
      </div>
      <div className="card-size">
        <h3>带操作</h3>
        <Message isIcon isClose>
          示例文案，这是一段示例文案用来参考，示例文案展示。需要滚动动画来实现对应的滚动操作
        </Message>
      </div>
    </div>
  )
}

export default PaginationDemo;