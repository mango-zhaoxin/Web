// createElement
// jsx  - 一个语言

{/* <div class="div">hello word</div> */ }
// { type: 'div', props: { class: 'div', children: [{ type: '', props: {nodeValue: 'hello world!'}}]}}

// vue-compile
{/* <div class="div">hello word!</div> */ }

// jsx -- babel-plugin
// const Empty = <div className="empty"></div>

const isArr = Array.isArray;
const toArray = arr => isArr(arr ?? []) ? arr : [arr];
const isText = txt => typeof txt === 'string' || typeof txt === 'number';
const flatten = arr =>
  [...arr.map(ar => isArr(ar)
    ? [...flatten(ar)]
    : isText(ar) ? createTextVNode(ar) : ar)]

// props.children 可以是多个对象

{/* <div class="div">hello word</div> */ }
// type: div
// props: {key: class, value: 'div'}
// children: {hello word}

// 最终返回结果：
// babel - plugin - jsx - transform -> h('div', { className: { 'empty'}, 'hello world'})

// h函数是createElement
export function h(type, props, ...kids) {
  props = props ?? {}
  kids = flatten(toArray(props.children ?? kids)).filter(Boolean)

  // 如果长度为1的话，react下面可以只有一个节点，props直接取数组里面的第一个对象，否则有多个节点的话，去取数组
  if (kids.length) {
    props.children = kids.length === 1 ? kids[0] : kids
  }

  const key = props.key ?? null
  const ref = props.ref ?? null

  delete props.key;
  delete props.ref;

  // h方法最终返回一个虚拟node节点, 返回的就是一个对象 
  return createVNode(type, props, key, ref)
}

// 创建文本的虚拟节点
function createTextVNode(text) {
  return {
    type: '',
    props: { nodeValue: text + '' }
  }
}

// 创建虚拟节点
function createVNode(type, props, key, ref) {
  return {
    type,
    props,
    key,
    ref
  }
}

export function Fragment(props) {
  return props.children;
}