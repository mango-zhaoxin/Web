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
        }

        const rejectedFnWithCatch = (resolve, reject, newPromise) => {
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
}

