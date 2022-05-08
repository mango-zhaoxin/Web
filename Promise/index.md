## 1. Promise 的含义

### 1.1 什么是 Promise?

Promise 是异步编程的一种解决方案，所谓的 Promise, 简单的说就是一个容器，里面保存着某个未来才会结束的事件（通常来说是一个异步操作）的结果。

### 1.2 Promise 的优缺点：

#### 优点

（1）对象的状态不受外界的影响。

Promise 对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和 rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。

（2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。

Promise 对象的状态改变，只有两种可能：从 pending 变为 fulfilled 和从 pending 变为 rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果。

#### 缺点

1. 无法取消 Promise，一旦新建它就会立即执行，无法中途取消.
2. 如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部。
3. 当处于 pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）.

## 2.Promise 的基本用法

Promise 对象是一个构造函数，用来生成 Promise 实例。

Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 resolve 和 reject。

举一个简单的 🌰

```js
const promise = new Promise((resolve, reject) => {
    if (/* 异步操作成功 */) {
        resolve(value)
    } else {
        reject(errors)
    }
})
```

resolve 函数

resolve 函数的作用是，将 Promise 对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved）），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；

reject 函数

reject 函数的作用是，将 Promise 对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

Promise 实例生成以后，可以用 then 方法分别指定 resolved 状态和 rejected 状态的回调函数。

```js
promise.then(
  function (value) {
    // success
  },
  function (error) {
    // failure
  }
);
```

then 方法可以接受两个回调函数作为参数。第一个回调函数是 Promise 对象的状态变为 resolved 时调用，第二个回调函数是 Promise 对象的状态变为 rejected 时调用。这两个函数都是可选的，不一定要提供。它们都接受 Promise 对象传出的值作为参数。

### 2.1 promise 执行顺序

```js
let promise = new Promise(function (resolve, rejected) {
  console.log("promise");
  resolve();
});

promise.then(function () {
  console.log("resolved");
});

console.log("hi");
```

执行结果：

promise
hi
resolved

### 2.2 resolve 和 reject 带参数

如果调用 resolve 函数和 reject 函数时带有参数，那么它们的参数会被传递给回调函数。reject 函数的参数通常是 Error 对象的实例，表示抛出的错误；resolve 函数的参数除了正常的值以外，还可能是另一个 Promise 实例，比如像下面这样。

```js
const p1 = new Promise(function (resolve, reject) {
  // ...
});

const p2 = new Promise(function (resolve, reject) {
  // ...
  resolve(p1);
});
```

上面代码中，p1 和 p2 都是 Promise 的实例，但是 p2 的 resolve 方法将 p1 作为参数，即一个异步操作的结果是返回另一个异步操作。

注意，这时 p1 的状态就会传递给 p2，也就是说，p1 的状态决定了 p2 的状态。如果 p1 的状态是 pending，那么 p2 的回调函数就会等待 p1 的状态改变；如果 p1 的状态已经是 resolved 或者 rejected，那么 p2 的回调函数将会立刻执行。

再来看一个 🌰

```js
const p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error("fail")), 3000);
});

const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000);
});

p2.then((result) => console.log(result)).catch((error) => console.log(error));
// Error: fail
```

上面代码中，p1 是一个 Promise，3 秒之后变为 rejected。p2 的状态在 1 秒之后改变，resolve 方法返回的是 p1。由于 p2 返回的是另一个 Promise，导致 p2 自己的状态无效了，由 p1 的状态决定 p2 的状态。所以，后面的 then 语句都变成针对后者（p1）。又过了 2 秒，p1 变为 rejected，导致触发 catch 方法指定的回调函数。

## promise.then

then 方法的第一个参数是 resolved 状态的回调函数，第二个参数是 rejected 状态的回调函数，它们都是可选的。

then 方法返回的是一个新的 Promise 实例（注意，不是原来那个 Promise 实例）。因此可以采用链式写法，即 then 方法后面再调用另一个 then 方法。

## promise.then.catch

一般来说，不要在 then()方法里面定义 Reject 状态的回调函数（即 then 的第二个参数），总是使用 catch 方法。

```js
// bad
promise.then(
  function (data) {
    // success
  },
  function (err) {
    // error
  }
);

// good
promise
  .then(function (data) {
    //cb
    // success
  })
  .catch(function (err) {
    // error
  });
```

上面代码中，第二种写法要好于第一种写法，理由是第二种写法可以捕获前面 then 方法执行中的错误，也更接近同步的写法（try/catch）。因此，建议总是使用 catch()方法，而不使用 then()方法的第二个参数。

注意：

如果没有使用 catch()方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。

```js
const someAsyncThing = function () {
  return new Promise(function (resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function () {
  console.log("everything is great");
});

setTimeout(() => {
  console.log(123);
}, 2000);
// Uncaught (in promise) ReferenceError: x is not defined
// 123
```

上面代码中，someAsyncThing()函数产生的 Promise 对象，内部有语法错误。浏览器运行到这一行，会打印出错误提示 ReferenceError: x is not defined，但是不会退出进程、终止脚本执行，2 秒之后还是会输出 123。这就是说，Promise 内部的错误不会影响到 Promise 外部的代码，通俗的说法就是“Promise 会吃掉错误”。

一般总是建议，Promise 对象后面要跟 catch()方法，这样可以处理 Promise 内部发生的错误。catch()方法返回的还是一个 Promise 对象，因此后面还可以接着调用 then()方法。

```js
const someAsyncThing = function () {
  return new Promise(function (resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing()
  .catch(function (error) {
    console.log("oh no", error);
  })
  .then(function () {
    console.log("carry on");
  });
// oh no [ReferenceError: x is not defined]
// carry on
```

上面代码运行完 catch()方法指定的回调函数，会接着运行后面那个 then()方法指定的回调函数。如果没有报错，则会跳过 catch()方法。

```js
Promise.resolve()
  .catch(function (error) {
    console.log("oh no", error);
  })
  .then(function () {
    console.log("carry on");
  });
// carry on
```

上面的代码因为没有报错，跳过了 catch()方法，直接执行后面的 then()方法。此时，要是 then()方法里面报错，就与前面的 catch()无关了。

如果这个时候，想要去监听 .then 函数里面的报错信息，就需要在后面加一个 catch 函数，这样，后面的这一个 catch 函数就能够监听到 then 函数里面的报错

## promise.finally
