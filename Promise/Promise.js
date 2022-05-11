// 第二步：定义三种状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// 第一步：定义一个class
class MPromise {
    constructor(fn) {
        // 第三步：定义初始值
        this.state = PENDING;
        this.value = null;
        this.reason = null;

        // 第五步： promise添加入参
        try {
            fn(this.resolve.bind(this), this.reject.bind(this))
        } catch (e) {
            this.reject(e)
        }
    }

    // 6.3 定义数据，存储数据
    FULFILLED_CALLBACK_LIST = [];
    REJECTED_CALLBACK_LIST = [];
    _status = PENDING;

    // 6.4 status变化处理
    get status() {
        return this._status;
    }

    set status(newStatus) {
        switch (newStatus) {
            case FULFILLED: {
                this.FULFILLED_CALLBACK_LIST.forEach(callback => {
                    callback(this.value)
                })
                break
            }

            case REJECTED: {
                this.REJECTED_CALLBACK_LIST.forEach(callback => {
                    callback(this.reason)
                })
                break;
            }
        }
    }

    // 第四步：实现 resolve 和 reject 方法
    resolve(value) {
        if (this.state === PENDING) {
            this.state = FULFILLED;
            this.value = value;
        }
    }

    reject(reason) {
        if (this.state === PENDING) {
            this.state = REJECTED;
            this.reason = reason;
        }
    }

    // 第六步：实现then方法
    then(onFulfilled, onRejected) {
        const fulFilledFn = isFunction(onFulfilled) ? onFulfilled : (value) => {
            return value;
        }

        const rejectedFn = isFunction(onRejected) ? onRejected : (reason) => {
            throw reason;
        }

        // 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
        // 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因
        // 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行resolvePromise方法

        const fulFilledFnWithCatch = (resolve, reject, newPromise) => {
            queueMicrotask(() => {
                try {
                    if (!this.isFunction(onFulfilled)) {
                        resolve(this.value)
                    } else {
                        const x = fulFilledFn(this.value);
                        this.resolvePromise(newPromise, x, resolve, reject)
                    }
                } catch (e) {
                    reject(e);
                }
            })
        }

        const rejectedFnWithCatch = (resolve, reject, newPromise) => {
            queueMicrotask(() => {
                try {
                    if (!this.isFunction(onRejected)) {
                        rejectedFn(this.reason);
                    } else {
                        const x = rejectedFn(this.reason);
                        this.resolvePromise(newPromise, x, resolve, reject)
                    }
                } catch (e) {
                    reject(e)
                }
            })
        }

        // 6.2 根据当前的 Promise 状态，调用不同的函数
        switch (this.state) {
            case FULFILLED: {
                const newPromise = new MPromise((resolve, reject) => fulFilledFnWithCatch(resolve, reject, newPromise))
                return newPromise;
            }

            case REJECTED: {
                const newPromise = new MPromise((resolve, reject) => rejectedFnWithCatch(resolve, reject, newPromise))
                return newPromise
            }

            case PENDING: {
                const newPromise = new MPromise((resolve, reject) => {
                    this.FULFILLED_CALLBACK_LIST.push(() => fulFilledFnWithCatch(resolve, reject, newPromise));
                    this.REJECTED_CALLBACK_LIST.push(() => rejectedFnWithCatch(resolve, reject, newPromise));
                })
                return newPromise
            }
        }
    }

    // 6.1 检查并处理参数，之前提到的如果不是 function, 就忽略. 这个忽略指的是原样返回 value 或 reason
    isFunction(param) {
        return typeof param === 'function'
    }

    resolvePromise(newPromise, x, resolve, reject) {
        // 如果 newPromise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 newPromise
        // 这是为了防止死循环
        if (newPromise === x) {
            throw reject(new TypeError('The promise and the return value are the same'))
        }

        if (x instanceof MPromise) {
            // 如果 x 为 Promise ，则使 newPromise 接受 x 的状态
            // 也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
            x.then((y) => {
                this.resolvePromise(newPromise, y, resolve, reject)
            }, reject);
        } else if (typeof x === 'object' || this.isFunction(x)) {
            // 如果 x 为对象或者函数
            if (x === null) {
                // null也会被判断为对象
                return resolve(x)
            }

            let then = null;

            try {
                // 把 x.then 赋值给 then 
                then = x.then
            } catch (error) {
                // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
                return reject(error)
            }

            // 如果 then 是函数
            if (isFunction(then)) {
                let called = false;
                // 将 x 作为函数的作用域 this 调用
                // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
                try {
                    then.call(
                        x,
                        // 如果 resolvePromise 以值 y 为参数被调用，则运行 resolvePromise
                        (y) => {
                            // 需要有一个变量called来保证只调用一次.
                            if (called) return;
                            called = true;
                            this.resolvePromise(newPromise, y, resolve, reject)
                        },
                        // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                        (r) => {
                            if (called) return;
                            called = true;
                            reject(r);
                        }
                    )
                } catch (error) {
                    // 如果调用 then 方法抛出了异常 e
                    if (called) return;

                    // 否则以 e 为据因拒绝 promise
                    reject(error)
                }
            } else {
                // 如果 then 不是函数，以 x 为参数执行 promise
                resolve(x)
            }

        } else {
            // 如果 x 不为对象或者函数，以 x 为参数执行 promise
            resolve(x);
        }
    }
}

