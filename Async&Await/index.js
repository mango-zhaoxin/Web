function longTimeFn(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(time);
        }, time);
    })
};

function asyncFunc(generator) {
    const iterator = generator(); // 接下来要执行next
    // data为第一次执行之后的返回结果，用于传给第二次执行
    const next = (data) => {
        const {
            value,
            done
        } = iterator.next(data); // 第二次执行，并接收第一次的请求结果 value 和 done

        if (done) return; // 执行完毕, 直接返回
        // 第一次执行next时，yield返回的 promise实例 赋值给了 value
        value.then(data => {
            next(data); // 当第一次value 执行完毕且成功时，执行下一步(并把第一次的结果传递下一步)
        });
    }
    next();
};

asyncFunc(function* () {
    let data = yield longTimeFn(1000);
    console.log(data);
    data = yield longTimeFn(2000);
    console.log(data);
    return data;
})