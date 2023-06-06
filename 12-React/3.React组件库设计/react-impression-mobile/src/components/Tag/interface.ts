export interface TagProps {
  className?: string, // 需要传递的class, 可以自己在demo里面去传递想要的类名，然后去写自己想要的样式去约束
  children?: React.ReactNode, // 传递的包裹的内容
  type?: string, // 对应的标签的内容
  isRound?: boolean, // 这个标签有没有圆角
  isPlain?: boolean, // 这个表情是都是空心的
}