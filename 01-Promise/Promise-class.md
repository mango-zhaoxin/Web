# 一步步实现一个 Promise

1. 平常用 promise 的时候, 是通过 new 关键字来 new Promise(), 所以咱们应该用构造函数或者 class 来实现. 以下 Promise 的实现，采用 class 的方式进行实现.

   ```js
   class MPromise {
     constructor() {}
   }
   ```

2. 定义三种状态类型

   ```js
   const PENDING = "pending";
   const FULFILLED = "fulfilled";
   const REJECTED = "rejected";
   ```

3. 设置初始状态

   ```js
   class MPromise {
     constructor() {
       // 初始状态为pending
       this.status = PENDING;
       this.value = null;
       this.reason = null;
     }
   }
   ```

4. resolve 和 reject 方法

   1. 根据刚才的规范, 这两个方法是要更改 status 的, 从 pending 改到 fulfilled/rejected.
   2. 注意两个函数的入参分别是 value 和 reason.

   ```js
   class MPromise {
     constructor() {
       // 初始状态为pending
       this.status = PENDING;
       this.value = null;
       this.reason = null;
     }

     resolve(value) {
       if (this.status === PENDING) {
         this.status = FULFILLED;
         this.value = value;
       }
     }

     reject(reason) {
       if (this.status === PENDING) {
         this.status = REJECTED;
         this.reason = reason;
       }
     }
   }
   ```

5. 是不是发现咱们的 promise 少了入参, 咱们来加一下

   1. 入参是一个函数, 函数接收 resolve 和 reject 两个参数.
   2. 注意在初始化 promise 的时候, 就要执行这个函数, 并且有任何报错都要通过 reject 抛出去

   ```js
   class MPromise {
     constructor(fn) {
       // 初始状态为pending
       this.status = PENDING;
       this.value = null;
       this.reason = null;

       try {
         fn(this.resolve.bind(this), this.reject.bind(this));
       } catch (e) {
         this.reject(e);
       }
     }

     resolve(value) {
       if (this.status === PENDING) {
         this.status = FULFILLED;
         this.value = value;
       }
     }

     reject(reason) {
       if (this.status === PENDING) {
         this.status = REJECTED;
         this.reason = reason;
       }
     }
   }
   ```

6. 接下来来实现一下关键的 then 方法

   1. then 接收两个参数, onFulfilled 和 onRejected

   ```js
   then(onFulfilled, onRejected) {}
   ```

   2. 检查并处理参数, 之前提到的如果不是 function, 就忽略. 这个忽略指的是原样返回 value 或者 reason.

   ```js
   isFunction(param) {
       return typeof param === 'function';
   }

   then(onFulfilled, onRejected) {
       const fulFilledFn = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
           return value;
       }
       const rejectedFn = this.isFunction(onRejected) ? onRejected : (reason) => {
           throw reason
       };
   }
   ```

   3. 根据当前 promise 的状态, 调用不同的函数

   ```js
   then(onFulfilled, onRejected) {
       const fulFilledFn = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
           return value;
       }
       const rejectedFn = this.isFunction(onRejected) ? onRejected : (reason) => {
           throw reason;
       };

       switch (this.status) {
           case FULFILLED: {
               fulFilledFn(this.value);
               break;
           }
           case REJECTED: {
               rejectedFn(this.reason);
               break;
           }
       }
   }
   ```

   4. 这个时候有的同学要问了, 你这样写, 是在 then 函数被调用的瞬间就会执行. 那这时候如果 status 还没变成 fulfilled 或者 rejected 怎么办, 很有可能还是 pending 的.

      1. 那么我们首先要拿到所有的回调, 然后才能在某个时机去执行他. 新建两个数组, 来分别存储成功和失败的回调, 调用 then 的时候, 如果还是 pending 就存入数组.

      ```js
      then(onFulfilled, onRejected) {
          const fulFilledFn = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
              return value;
          }
          const rejectedFn = this.isFunction(onRejected) ? onRejected : (reason) => {
              throw reason;
          };

          switch (this.status) {
              case FULFILLED: {
                  fulFilledFn(this.value);
                  break;
              }
              case REJECTED: {
                  rejectedFn(this.reason);
                  break;
              }
              case PENDING: {
                  this.FULFILLED_CALLBACK_LIST.push(realOnFulfilled);
                  this.REJECTED_CALLBACK_LIST.push(realOnRejected);
                  break;
              }
          }
      }
      ```

      2. 在 status 发生变化的时候, 就执行所有的回调. 这里咱们用一下 es6 的 getter 和 setter. 这样更符合语义, 当 status 改变时, 去做什么事情. (当然也可以顺序执行, 在给 status 赋值后, 下面再加一行 forEach)

      ```js
      get status() {
          return this._status;
      }

      set status(newStatus) {
          switch (newStatus) {
              case FULFILLED: {
                  this.FULFILLED_CALLBACK_LIST.forEach(callback => {
                      callback(this.value);
                  });
                  break;
              }
              case REJECTED: {
                  this.REJECTED_CALLBACK_LIST.forEach(callback => {
                      callback(this.reason);
                  });
                  break;
              }
          }
      }
      ```

7. then 的返回值
   这块内容比较多, 所以单拿出来了

   7.1 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e。(这样的话, 我们就需要手动 catch 代码，遇到报错就 reject)

   ```js
   then(onFulfilled, onRejected) {
       const fulFilledFn = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
           return value;
       }
       const rejectedFn = this.isFunction(onRejected) ? onRejected : (reason) => {
           throw reason;
       };

       const fulFilledFnWithCatch = (resolve, reject) => {
           try {
               fulFilledFn(this.value);
           } catch (e) {
               reject(e)
           }
       };

       const rejectedFnWithCatch = (resolve, reject) => {
           try {
               rejectedFn(this.reason);
           } catch (e) {
               reject(e);
           }
       }

       switch (this.status) {
           case FULFILLED: {
               return new MPromise(fulFilledFnWithCatch);
           }
           case REJECTED: {
               return new MPromise(rejectedFnWithCatch);
           }
           case PENDING: {
               return new MPromise((resolve, reject) => {
                   this.FULFILLED_CALLBACK_LIST.push(() => fulFilledFnWithCatch(resolve, reject));
                   this.REJECTED_CALLBACK_LIST.push(() => rejectedFnWithCatch(resolve, reject));
               });
           }
       }
   }
   ```

   7.2 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值

   ```js
   const fulFilledFnWithCatch = (resolve, reject) => {
     try {
       fulFilledFn(this.value);
       resolve(this.value);
     } catch (e) {
       reject(e);
     }
   };
   ```

   7.3 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因。

   需要注意的是，如果 promise1 的 onRejected 执行成功了，promise2 应该被 resolve

   ```js
   const rejectedFnWithCatch = (resolve, reject) => {
     try {
       rejectedFn(this.reason);
       if (this.isFunction(onRejected)) {
         resolve();
       }
     } catch (e) {
       reject(e);
     }
   };
   ```

   7.4 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行 resolvePromise 方法

   ```js
   then(onFulfilled, onRejected) {
       const fulFilledFn = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
           return value;
       }
       const rejectedFn = this.isFunction(onRejected) ? onRejected : (reason) => {
           throw reason;
       };

       const fulFilledFnWithCatch = (resolve, reject, newPromise) => {
           try {
               if (!this.isFunction(onFulfilled)) {
                   resolve(this.value);
               } else {
                   const x = fulFilledFn(this.value);
                   this.resolvePromise(newPromise, x, resolve, reject);
               }
           } catch (e) {
               reject(e)
           }
       };

       const rejectedFnWithCatch = (resolve, reject, newPromise) => {
           try {
               if (!this.isFunction(onRejected)) {
                   reject(this.reason);
               } else {
                   const x = rejectedFn(this.reason);
                   this.resolvePromise(newPromise, x, resolve, reject);
               }
           } catch (e) {
               reject(e);
           }
       }

       switch (this.status) {
           case FULFILLED: {
               const newPromise = new MPromise((resolve, reject) => fulFilledFnWithCatch(resolve, reject, newPromise));
               return newPromise;
           }
           case REJECTED: {
               const newPromise = new MPromise((resolve, reject) => rejectedFnWithCatch(resolve, reject, newPromise));
               return newPromise;
           }
           case PENDING: {
               const newPromise = new MPromise((resolve, reject) => {
                   this.FULFILLED_CALLBACK_LIST.push(() => fulFilledFnWithCatch(resolve, reject, newPromise));
                   this.REJECTED_CALLBACK_LIST.push(() => rejectedFnWithCatch(resolve, reject, newPromise));
               });
               return newPromise;
           }
       }
   }
   ```

8. resolvePromise

   ```js
   resolvePromise(newPromise, x, resolve, reject) {
       // 如果 newPromise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 newPromise
       // 这是为了防止死循环
       if (newPromise === x) {
           return reject(new TypeError('The promise and the return value are the same'));
       }

       if (x instanceof MPromise) {
           // 如果 x 为 Promise ，则使 newPromise 接受 x 的状态
           // 也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
           // 这个if跟下面判断then然后拿到执行其实重复了，可有可无
           x.then((y) => {
               resolvePromise(newPromise, y, resolve, reject);
           }, reject);
       } else if (typeof x === 'object' || this.isFunction(x)) {
           // 如果 x 为对象或者函数
           // 这个坑是跑测试的时候发现的，如果x是null，应该直接resolve
           if (x === null) {
               return resolve(x);
           }

           let then = null;

           try {
               // 把 x.then 赋值给 then
               then = x.then;
           } catch (error) {
               // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
               return reject(error);
           }

           // 如果 then 是函数
           if (this.isFunction(then)) {
               let called = false;
               // 将 x 作为函数的作用域 this 调用之
               // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
               // 名字重名了，我直接用匿名函数了
               try {
                   then.call(
                       x,
                       // 如果 resolvePromise 以值 y 为参数被调用，则运行 resolvePromise
                       (y) => {
                           // 如果 resolvePromise 和 rejectPromise 均被调用，
                           // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
                           // 实现这条需要前面加一个变量called
                           if (called) return;
                           called = true;
                           resolvePromise(promise, y, resolve, reject);
                       },
                       // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                       (r) => {
                           if (called) return;
                           called = true;
                           reject(r);
                       });
               } catch (error) {
                   // 如果调用 then 方法抛出了异常 e：
                   // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
                   if (called) return;

                   // 否则以 e 为据因拒绝 promise
                   reject(error);
               }
           } else {
               // 如果 then 不是函数，以 x 为参数执行 promise
               resolve(x);
           }
       } else {
           // 如果 x 不为对象或者函数，以 x 为参数执行 promise
           resolve(x);
       }
   }
   ```

9. onFulfilled 和 onRejected 是微任务

   咱们可以用 queueMicrotask 包裹执行函数

   ```js
   then(onFulfilled, onRejected) {
       const fulFilledFn = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
           return value;
       }
       const rejectedFn = this.isFunction(onRejected) ? onRejected : (reason) => {
           throw reason;
       };

       const fulFilledFnWithCatch = (resolve, reject, newPromise) => {
           queueMicrotask(() => {
               try {
                   if (!this.isFunction(onFulfilled)) {
                       resolve(this.value);
                   } else {
                       const x = fulFilledFn(this.value);
                       this.resolvePromise(newPromise, x, resolve, reject);
                   }
               } catch (e) {
                   reject(e)
               }
           })
       };

       const rejectedFnWithCatch = (resolve, reject, newPromise) => {
           queueMicrotask(() => {
               try {
                   if (!this.isFunction(onRejected)) {
                       reject(this.reason);
                   } else {
                       const x = rejectedFn(this.reason);
                       this.resolvePromise(newPromise, x, resolve, reject);
                   }
               } catch (e) {
                   reject(e);
               }
           })
       }

       switch (this.status) {
           case FULFILLED: {
               const newPromise = new MPromise((resolve, reject) => fulFilledFnWithCatch(resolve, reject, newPromise));
               return newPromise;
           }
           case REJECTED: {
               const newPromise = new MPromise((resolve, reject) => rejectedFnWithCatch(resolve, reject, newPromise));
               return newPromise;
           }
           case PENDING: {
               const newPromise = new MPromise((resolve, reject) => {
                   this.FULFILLED_CALLBACK_LIST.push(() => fulFilledFnWithCatch(resolve, reject, newPromise));
                   this.REJECTED_CALLBACK_LIST.push(() => rejectedFnWithCatch(resolve, reject, newPromise));
               });
               return newPromise;
           }
       }
   }
   ```

10. 简单写点代码测试一下

    ```js
    const test = new MPromise((resolve, reject) => {
      setTimeout(() => {
        resolve(111);
      }, 1000);
    }).then(console.log);

    console.log(test);

    setTimeout(() => {
      console.log(test);
    }, 2000);
    ```

    这个时候同学们会发现, 为什么我可以调用.then, 不可以调用.catch 呢? 因为我们并没有在类里面声明 catch 方法

11. catch 方法

    ```js
    catch (onRejected) {
        return this.then(null, onRejected);
    }
    ```

12. promise.resolve

    将现有对象转为 Promise 对象，如果 Promise.resolve 方法的参数，不是具有 then 方法的对象（又称 thenable 对象），则返回一个新的 Promise 对象，且它的状态为 fulfilled。

    ```js
    static resolve(param) {
        if (param instanceof MyPromise) {
            return param;
        }

        return new MyPromise(function (resolve) {
            resolve(param);
        });
    }
    ```

13. promise.reject

    返回一个新的 Promise 实例，该实例的状态为 rejected。Promise.reject 方法的参数 reason，会被传递给实例的回调函数。

    ```js
    static reject(reason) {
        return new MPromise((resolve, reject) => {
            reject(reason);
        });
    }
    ```

14. promise.race

    `const p = Promise.race([p1, p2, p3]);`

    该方法是将多个 Promise 实例，包装成一个新的 Promise 实例。
    只要 p1、p2、p3 之中有一个实例率先改变状态，p 的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给 p 的回调函数。

    ```js
    static race(promiseList) {
        return new MPromise((resolve, reject) => {
            const length = promiseList.length;

            if (length === 0) {
                return resolve();
            } else {
                for (let i = 0; i < length; i++) {
                    MPromise.resolve(promiseList[i]).then(
                        (value) => {
                            return resolve(value);
                        },
                        (reason) => {
                            return reject(reason);
                        });
                }
            }
        });

    }
    ```

    写段测试代码

    ```js
    const test = new MPromise((resolve, reject) => {
      setTimeout(() => {
        resolve(111);
      }, 1000);
    });

    const test2 = new MPromise((resolve, reject) => {
      setTimeout(() => {
        resolve(222);
      }, 2000);
    });

    const test3 = new MPromise((resolve, reject) => {
      setTimeout(() => {
        resolve(333);
      }, 3000);
    });

    MPromise.race([test, test2, test3]).then(console.log);
    ```
