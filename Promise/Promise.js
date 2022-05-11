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

        // 根据当前的 Promise 状态，调用不同的函数
        switch (this.state) {
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

    // 检查并处理参数，之前提到的如果不是 function, 就忽略. 这个忽略指的是原样返回 value 或 reason
    isFunction(param) {
        return typeof param === 'function'
    }
}

