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
        const fulFilledFn = isFunction(onFulfilled) ? isFunction(onFulfilled) : (value) => {
            return value;
        }

        const rejectedFn = isFunction(onRejected) ? isFunction(onRejected) : (reason) => {
            throw reason;
        }

        // 6.2 根据当前的 Promise 状态，调用不同的函数
        switch (this.state) {
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

    // 6.1 检查并处理参数，之前提到的如果不是 function, 就忽略. 这个忽略指的是原样返回 value 或 reason
    isFunction(param) {
        return typeof param === 'function'
    }
}

