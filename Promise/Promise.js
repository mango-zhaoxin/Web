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
}

