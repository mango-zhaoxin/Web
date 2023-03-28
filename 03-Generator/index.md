每次调用遍历器对象的 next 方法，就会返回一个有着 value 和 done 两个属性的对象。
value 属性表示当前的内部状态的值，是 yield 表达式后面那个表达式的值；
done 属性是一个布尔值，表示是否遍历结束。

## for...of 循环

for...of 循环可以自动遍历 Generator 函数运行时生成的 Iterator 对象，且此时不再需要调用 next 方法。

```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let i of foo()) {
  console.log(i);
}

// 1 2 3 4 5
```

上面代码使用 for...of 循环，依次显示 5 个 yield 表达式的值。这里需要注意，一旦 next 方法的返回对象的 done 属性为 true，for...of 循环就会中止，且不包含该返回对象，所以上面代码的 return 语句返回的 6，不包括在 for...of 循环之中。

## Generator.prototype.throw()

# Generator 和 Async 简介

在讲 Generator 之前, 咱们要来先了解另外一个概念, 迭代器.

## 迭代器 Iterator

迭代器 Iterator 是 ES6 引入的一种新的遍历机制，同时也是一种特殊对象，它具有一些专门为迭代过程设计的专有接口。

每个迭代器对象都有一个 next()方法，每次调用都返回一个当前结果对象。当前结果对象中有两个属性：

1. value：当前属性的值

2. done：用于判断是否遍历结束，当没有更多可返回的数据时，返回 true

每调用一次 next()方法，都会返回下一个可用的值，直到遍历结束。

## 生成器 Generator

生成器是一种返回迭代器的函数，通过 function 关键字后的星号(\*)来表示，函数中会用到新的关键字 yield。星号可以紧挨着 function 关键字，也可以在中间添加一个空格.

```js
function* generator() {
  const list = [1, 2, 3];
  for (let i of list) {
    yield i;
  }
}

let g = generator();

console.log(g.next()); // {value: 1, done: false}
console.log(g.next()); // {value: 2, done: false}
console.log(g.next()); // {value: 3, done: false}
console.log(g.next()); // {value: undefined, done: true}
```

### 特性

1. 每当执行完一条 yield 语句后函数就会自动停止执行, 直到再次调用 next();
2. yield 关键字只可在生成器内部使用，在其他地方使用会导致程序抛出错误;
3. 可以通过函数表达式来创建生成器, 但是不能使用箭头函数
   `let generator = function *(){}`
