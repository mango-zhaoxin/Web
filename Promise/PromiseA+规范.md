# PromiseA+ 规范

## 一. 术语

1. promise 是一个有 then 方法的对象或者是函数
2. thenable 是一个有 then 方法的对象或者是函数
3. value 是 Promise 状态成功时的值, 也是 resolve 的参数, 包括各种数据类型, 也包括 undefined/thenable 或者是 promise
4. reason 是 promise 状态失败时的值, 也就是 reject 的参数, 表示拒绝的原因
5. exception 是一个使用 throw 抛出的异常值

## 二. 规范

接下来分几部分来讲解 PromiseA+规范.

### 2.1. Promise States

promise 应该有三种状态. 要注意他们之间的流转关系.

1. pending

   1.1 初始的状态, 可改变.
   1.2 一个 promise 在 resolve 或者 reject 前都处于这个状态。
   1.3 可以通过 resolve -> fulfilled 状态;
   1.4 可以通过 reject -> rejected 状态;

2. fulfilled

   2.1 最终态, 不可变.
   2.2 一个 promise 被 resolve 后会变成这个状态.
   2.3 必须拥有一个 value 值

3. rejected

   3.1 最终态, 不可变.
   3.2 一个 promise 被 reject 后会变成这个状态
   3.3 必须拥有一个 reason

Tips: 总结一下, 就是 promise 的状态流转是这样的

pending -> resolve(value) -> fulfilled
pending -> reject(reason) -> rejected

看一下图, 可能会更清晰一点, https://www.processon.com/diagraming/606569d1e401fd13004977d2

### 2.2 then

promise 应该提供一个 then 方法, 用来访问最终的结果, 无论是 value 还是 reason.

```js
promise.then(onFulfilled, onRejected);
```

1. 参数要求

   1.1 onFulfilled 必须是函数类型, 如果不是函数, 应该被忽略.
   1.2 onRejected 必须是函数类型, 如果不是函数, 应该被忽略.

2. onFulfilled 特性

   2.1 在 promise 变成 fulfilled 时，应该调用 onFulfilled, 参数是 value
   2.2 在 promise 变成 fulfilled 之前, 不应该被调用.
   2.3 只能被调用一次(所以在实现的时候需要一个变量来限制执行次数)

3. onRejected 特性

   3.1 在 promise 变成 rejected 时，应该调用 onRejected, 参数是 reason
   3.2 在 promise 变成 rejected 之前, 不应该被调用.
   3.3 只能被调用一次(所以在实现的时候需要一个变量来限制执行次数)

4. onFulfilled 和 onRejected 应该是微任务

   这里用 queueMicrotask 来实现微任务的调用.

5. then 方法可以被调用多次

   5.1 promise 状态变成 fulfilled 后，所有的 onFulfilled 回调都需要按照 then 的顺序执行, 也就是按照注册顺序执行(所以在实现的时候需要一个数组来存放多个 onFulfilled 的回调)
   5.2 promise 状态变成 rejected 后，所有的 onRejected 回调都需要按照 then 的顺序执行, 也就是按照注册顺序执行(所以在实现的时候需要一个数组来存放多个 onRejected 的回调)

6. 返回值

   then 应该返回一个 promise

   ```js
   promise2 = promise1.then(onFulfilled, onRejected);
   ```

   6.1 onFulfilled 或 onRejected 执行的结果为 x, 调用 resolvePromise( 这里大家可能难以理解, 可以先保留疑问, 下面详细讲一下 resolvePromise 是什么东西 )
   6.2 如果 onFulfilled 或者 onRejected 执行时抛出异常 e, promise2 需要被 reject
   6.3 如果 onFulfilled 不是一个函数, promise2 以 promise1 的 value 触发 fulfilled
   6.4 如果 onRejected 不是一个函数, promise2 以 promise1 的 reason 触发 rejected

7. resolvePromise

   ```js
   resolvePromise(promise2, x, resolve, reject);
   ```

   7.1 如果 promise2 和 x 相等，那么 reject TypeError

   7.2 如果 x 是一个 promise
   如果 x 是 pending 态，那么 promise 必须要在 pending, 直到 x 变成 fulfilled 或者 rejected.
   如果 x 被 fulfilled, fulfill promise with the same value.
   如果 x 被 rejected, reject promise with the same reason.

   7.3 如果 x 是一个 object 或者 是一个 function
   let then = x.then.
   如果 x.then 这步出错，那么 reject promise with e as the reason.
   如果 then 是一个函数，then.call(x, resolvePromiseFn, rejectPromise)
   resolvePromiseFn 的 入参是 y, 执行 resolvePromise(promise2, y, resolve, reject);
   rejectPromise 的 入参是 r, reject promise with r.
   如果 resolvePromise 和 rejectPromise 都调用了，那么第一个调用优先，后面的调用忽略。
   如果调用 then 抛出异常 e
   如果 resolvePromise 或 rejectPromise 已经被调用，那么忽略
   则，reject promise with e as the reason
   如果 then 不是一个 function. fulfill promise with x.
