## React基础知识

### 一、JSX介绍
我们可以直接引⼊ react.js 和 react-dom.js 两个库，使⽤react 时，我们可以使⽤ jsx 语法来书写我们的模版

```html
<div className="foo">bar</div>
```

这是⼀种⾮常类似 DOM 的 xml 结构的语法，唯⼀有区别的是，我们可以在 jsx 中使⽤ {} 来使⽤ js 表达式

```js
<div className="foo">{something ? "something is true" : "something is false"}</div>
```

这⾥的表达式当然也可以执⾏函数，数组 map 等等形式，只需要这个式⼦是⼀个表达式即可，但这⾥要注意，千万不能直接在 jsx 中写执⾏诸如 if else 的形式，可以把它改造成⼀个三⽬运算符。

```js
<div className="foo">{if(xx) {xx} else {xx}}</div> // 错误
```

在 jsx 中我们需要保证渲染的内容必须是合法的 jsx 元素，合法的 jsx 元素有：

* 普通的 DOM 标签，如 div、p、span 等等
* 声明的 react 组件，例如通过 class 或函数创建的 jsx 组件
* null（最终会渲染⼀个空元素）
* 字符串（最终会渲染⼀个 text 节点）
* 对于数字类型，最终就会渲染出来，所以有的时候通过布尔表达式判断的时候就会有问题

```js
{false && (<p>this is false</p>)} // 不会渲染内容
{0 && (<p>this is false</p>)} // 会渲染 0
```

推荐写判断表达式的时候，都使用三目运算符的形式。
或者{{ !!0 && (<p>true</p>)}}的形式，前一个转化为布尔值


我们可以通过 React.isValidElement 来判断⼀个内容元素是不是⼀个合法的 react element。

同时需要注意的是，因为 class / for 这类的 html 属性是关键字，所以在 jsx 中我们想要使⽤，就必须使⽤className/htmlFor 的形式来定义。

```js
<label className="foo" htmlFor="name">label</label>
```

事实上我们并不能直接在浏览器中使⽤ jsx 内容，我们需要搭配⼀些编译库将 jsx 语法进⾏编译。⽐较知名的就是 babel，搭配 babel-plugin-transform-react-jsx 插件，可以将 jsx 编译为 react 的内部⽅法。

例如这个例⼦，经过 babel 和配套插件就可以将这种形式进⾏编译:

```js
<div>
 <h3 className="h3">{something ? "something is true" : "something is false"}</h3>
</div>
```

最终结果为：

```js
React.createElement(
 "div",
 null,
 React.createElement(
 "h3",
 {className: 'h3'},
 something ? "something is true" :"something is false"
 )
);
```

React.createElement 主要分为三类参数，第⼀个是组件的名字，第⼆个参数是当前组件接受的属性，第三个之后的参数都是当前组件嵌套的⼦组件。

### 二、JSX总结

* JSX是一种语法糖，我们需要将他们编译为 React.createElement 的形式。
* 写 jsx 需要注意类型必须合法，尤其是写布尔表达式的时候需要额外注意，尽量使⽤三⽬运算符来书写 jsx 
* 需要注意 class 和 for 标签在书写时需要改为 className 和 htmlFor。

### 三、create-react-app cli 的使⽤

create-react-app 是 react 官⽅维护的⼀个 cli ⼯具，⾥⾯封装了 webpack babel 等基本的⼯程化⼯具，让我们能快速上⼿和使⽤。

当然，我们也可以⾃⼰封装 webpack 配置来进⾏使⽤，封装⼀个可以编译 react 应⽤的脚⼿架⾮常简单，只需要配置所有 react ⽂件使⽤ babel + babel 转译 jsx 插件即可，最终编译的 js 内容即可直接应⽤于⻚⾯中。

有时候我们可以⾃⼰封装⼀些符合公司内部前端架构的 cli 应⽤。例如我们可以封装⼀个使⽤ ts 书写 react 应⽤的脚⼿架来为我们⾃⼰所⽤。

### 四、函数组件和 class 组件/受控组件和⾮受控组件

在 react 中，我们可以使⽤ class 形式或是函数的形式来进⾏创建⼀个组件，例如以下两种形式：

```js
function Foo(props) { 
  return (
    <div>{props.text|| 'Foo'}</div>
  );
}
 
class Bar extends React.Component {
  render() {
    return (
      <div>{this.props.text || 'Bar'}</div>
    );
  } 
}
```

这两种形式有何区别呢？我们简单对⽐⼀下：

* 加载的 props ⽅式不同，函数式定义组件从组件函数的参数加载。class 形式的组件通过 this.props 获取传⼊的参数.
* 函数式组件⽐较简单，内部⽆法维护状态。class 形式内部可以通过 this.state 和 this.setState ⽅法更新内部 state 和更新内部 state，同时更新 render ⾥⾯的函数渲染的结果.
* class 组件内部可以定义更多的⽅法在实例上，但是函数式组件⽆法定义.

事实上，函数式组件和 class 组件之间的区别也仅停留在部分组件确实不需要维护内部状态。class 组件定义稍微复杂⼀些，但是内部可以维护更多的⽅法和状态.


以input输入框为例子进行说明
受控组件：把输入的值放到一个state里面
非受控：直接取input输入的值

### 五、组件生命周期

在 class 形式的组件中，我们可以定义以下声明周期的⽅法，会在特定的时机执⾏它。（⽼版本）

componentWillMount -> render -> componentDidMount

componentWillReceiveProps -> componentWillUpdate -> render -> componentDidUpdate

这⾥需要注意的就是，同 vue 的声明周期⼀样，我们最好在 componentDidMount 中发送请求，这样整个组件对服务端渲染会⽐较友好。

### 常见错误和性能问题

### 异步过程使用单例的 event 对象

全局单例的 event 对象，在异步对象中使⽤ react 事件时需要额外注意。异步操作最好将对象内部需要的值先进⾏拷⻉赋值。

```html
<button onClick={this.handleClick1.bind(this)}>按钮点击1</button>
<button onClick={this.handleClick2}>按钮点击2</button>
```

```js
handleClick1(e) {
  setTimeout(function() {
    console.log('button1 click', e.currentTarget.innerText); // 显示：undefined 
  }, 1000);
  console.log('button1 click', e.currentTarget.innerText); // 显示：按钮点击1
}

handleClick2 = (e) => {
  console.log('button2 click', e.currentTarget.innerText); // 显示：按钮点击2
}
```

异步里面打印event, 结果显示undefined , 为什么？

异步使用 event 中的注意事项
在异步里面使用event, 需要先把 event 赋值出来，否则获取不到event, 直接使用的时候会报错，拿不到event。

问题：bind 为什么不能绑定到 render 函数里面？
因为每次 bind 的时候，都会返回一个新的函数。
推荐在 constructor 函数里面进行bind, 在组件上面进行bind的时候，每次都会进行重新渲染。

```js
constructor() {
  super(props) {
    this.handleClick1 = this.handleClick1.bind(this);
  }
}
```

不推荐在组件上面直接：renderRandomText={this.renderRandomText.bind(this)}

```js
class RenderText extends Component {
  shouldComponentUpdate(next) {
    const prev = this.props
    console.log(prev, next, 'log value info')
    console.log(next.renderRandomText === prev.renderRandomText)
    if (next.renderRandomText === prev.renderRandomText) {
      return false
    }
    return true
  }
  render() {
    return <button onClick={this.props.renderRandomText}>{this.props.text}</button>
  }
}
```

```js
renderRandomText() {
  this.setState({ text: 'text' })
}

render() {
  return (
    <div className="app">
      <RenderText text={this.state.text} renderRandomText={this.renderRandomText} />
    </div>
  )
}
```

组件⽣命周期，它描述了整个组件在创建、实例化、销毁过程中不同过程中执⾏的⽅法。我们需要特别注意，不要在 render 中定义单独引⽤的内容。也就是不要在 render 中使⽤箭头函数，否则很容易运⾏时造成⼦组件的重新渲染。

为了保证这种引⽤的相等，我们都会使⽤ immutable 的不可变数据，来保证组件间传递的数据引⽤相等.


### 性能优化方式

* 使⽤ react dev tools ，检测组件是否出现不必要的重新渲染。
* why-did-you-render 
  why did you render 是⼀个能检测你的⻚⾯中的元素是否出现了不必要的重渲染。https://www.npmjs.com/package/@welldone-so!ware/why-did-you-render, 我们可以将它应⽤于我们的项⽬中，来检测是否有⽆意义的渲染的情况.

### 介绍 immutable 库 immutable.js 和 immer

为了配合 shouldComponentUpdate 来进⾏性能优化，⼤部分时候我们需要复杂的层级判断，这⾥我们介绍两个配合 react 最⼩更新的 immutable 库 immutable-js 和 immer。

immutable-js 是 facebook 的⼯程师在 2014 年推出的，immer 则是 mobx 作者 2018 年推出的。他们的推出其实是为了实现不可变数据，但实际上这种做法更多的是为了优化我们的 react 应⽤⽽做的。

在 react 中使用 immutable-js

1. 安装Immutable.js：使用npm或yarn安装Immutable.js库。

```shell
npm install immutable
```

2. 导入Immutable.js：在你的React组件中导入Immutable.js库。
```js
import Immutable from 'immutable';
```

3. 创建不可变数据：使用Immutable.js的数据结构来创建不可变数据。常用的数据结构包括List、Map和Set。
```js
const list = Immutable.List([1, 2, 3]);
const map = Immutable.Map({ key: 'value' });
const set = Immutable.Set([1, 2, 3]);
```

4. 访问和更新数据：使用Immutable.js提供的方法来访问和更新不可变数据。
```js
const updatedList = list.push(4);
const updatedMap = map.set('key', 'new value');
const updatedSet = set.add(4);
```

5. 在React组件中使用不可变数据：在React组件中使用不可变数据时，你可以将它们存储在组件的状态或属性中。在渲染组件时，使用Immutable.js提供的方法来获取不可变数据的值。
```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: Immutable.List([1, 2, 3])
    };
  }

  handleClick() {
    // 更新不可变数据并更新组件状态
    const updatedList = this.state.list.push(4);
    this.setState({ list: updatedList });
  }

  render() {
    const { list } = this.state;

    return (
      <div>
        <ul>
          {list.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <button onClick={() => this.handleClick()}>Add Item</button>
      </div>
    );
  }
}
```

在上面的示例中，我们将list存储在组件的状态中，并使用Immutable.js的push方法来更新不可变列表。在渲染组件时，我们使用map方法来迭代列表的值，并呈现每个列表项。


思考：immutable的优点是什么？
没有更新的部分，保持着相同的引用，只更新改变的部分。


深拷贝

```js
const a = {
  key1: { value: 'valueKey1' },
  key2: { value: 'valueKey2' }
};

const b = coloneDeep(a);

b.key1 = 'valueb';

console.log(a, b, a.key2 === b.key2);
// { key1: { value: 'valueKey1' }, key2: { value: 'valueKey2' } }
// { key1: 'valueb', key2: { value: 'valueKey2' } }
// false

function coloneDeep(obj) {
  const keys = Object.keys(obj);
  return keys.reduce((memo, current) => {
    const value = obj[current]
    if (typeof value === 'object') {
      return {
        ...memo,
        [current]: coloneDeep(value)
      }
    }
    return {
      ...memo,
      [current]: value
    }
  }, {})
}
```

使用了深拷贝，断绝了原对象与新拷贝的对象之间的引用，带来的问题就是，引用断了，每次都会重新赋值，得到的是一个新的值，值要是变了，传递到子组件里面，就会导致子组件重新进行渲染，就跟在 render 里面绑定 this 是一样的.


为此，我们就可以通过上面的 immutable 做对应的优化，让其没有更新的部分，保持着相同的引用，只去更新改变了的部分，这样就可以提高我们的性能

我们可以这样去做处理，去使用 immutable

```js
const immutable = require('immutable');
const data = {
  key1: { value: 'valueKey1' },
  key2: { value: 'valueKey2' }
};
const a = immutable.formJS(data)
const b = a.set('key1', 'valueb')
console.log(a.get('key1'), b.get('key1'), a.key2 === b.key2);
// entries: ['value', 'valueKey1']
// valueb
// true
// 作用：key1的值已经改变了，但是key2的值仍然保持着引用
```

由上面的结果可以看出，key1的值已经发生了改变，但是key2的值仍然是相等的，保持着相同的引用，这就可以证明，immutable只会更新改变的部分，对没有更新的部分，仍然会保持着相同的引用。


介绍Immer

Immer 是一个用于简化不可变数据更新的 JavaScript 库。它提供了一种方便的方式来修改不可变的数据结构，而无需手动创建副本或进行繁琐的更新操作。使用 Immer，你可以以可变的方式编写代码，而在背后它会自动处理不可变性。

以下是 Immer 的一些主要特点和用法：

1. 简化的可变更新：使用 Immer，你可以在不直接修改原始数据的情况下，以一种可变的方式对数据进行更新。Immer 使用了一种称为“结构共享”的技术，通过创建一个不可变的草稿副本，记录你的更新操作，并将结果应用到原始数据上。这样你就可以像修改可变数据一样修改不可变数据。

2. 使用 produce 函数：在使用 Immer 时，你需要使用 produce 函数来创建一个可以进行不可变更新的代理对象。produce 函数接受一个原始数据和一个更新函数作为参数。在更新函数中，你可以以可变的方式修改数据，而在背后 Immer 会处理不可变性。

下面是一个简单的示例，展示了如何使用 Immer 的 produce 函数来更新不可变数据：

```js
import produce from 'immer';

const originalData = {
  name: 'John',
  age: 30
};

const updatedData = produce(originalData, draft => {
  draft.age = 31;
});

console.log(updatedData.age, originalData.age)
```

在上面的示例中，我们使用 produce 函数来更新 originalData 对象的 age 属性。draft 参数代表了可变的草稿副本，你可以直接修改它，而不会影响原始数据。在更新函数内部，我们将 draft.age 的值更新为 31，然后 updatedData 变量将得到包含更新后数据的新对象。

3. 嵌套更新和不可变性：Immer 还提供了嵌套更新和处理复杂数据结构的能力。当你更新一个对象的属性或一个数组的元素时，Immer 会确保正确处理嵌套的不可变性。这使得你可以轻松地对深层次的数据结构进行修改，而无需手动处理不可变性。

```js
import produce from 'immer';

const originalData = {
  name: 'John',
  address: {
    city: 'New York',
    country: 'USA'
  }
};

const updatedData = produce(originalData, draft => {
  draft.address.city = 'San Francisco';
});
```

在上面的示例中，我们更新了 originalData 对象的 address.city 属性。由于 Immer 的存在，我们可以直接修改 draft.address.city 的值，而不会影响其他属性或嵌套的对象的不可变性。
