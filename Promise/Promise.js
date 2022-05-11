// 第二步：定义三种状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// 第一步：定义一个class
class MPromise {
    constructor() {
        // 第三步：定义初始值
        this.state = PENDING;
        this.value = null;
        this.reason = null;
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

