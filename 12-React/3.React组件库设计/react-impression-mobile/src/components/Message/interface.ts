export interface MessageProps {
  className?: string, // 需要自己传进来的className
  children?: React.ReactNode, // 需要传递进来的节点
  type?: string,
  isIcon?: boolean, // 是否需要展示图标
  isScroll?: boolean, // 是否需要滚动动画
  isClose?: boolean, // 是否需要关闭按钮
}