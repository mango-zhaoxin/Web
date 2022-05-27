function longTimeFn(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(time);
        }, time)
    })
}

function* generator() {
    const list = [1, 2, 3];
    for (let i of list) {
        yield i;
    }
}

let g = generator();

console.log(g.next()); // {value: 1, done: false}
console.log(g.next()); // {value: 2, done: false}
console.log(g.next()); // {value: 3, done: false}
console.log(g.next()); // {value: undefined, done: true}