// function* helloWorldGenerator() {
//     yield 'hello';
//     yield 'world';
//     return 'ending';
// }

// var hw = helloWorldGenerator();

// // 调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象
// console.log(hw); // Object [Generator] {}

// console.log(hw.next())
// // { value: 'hello', done: false }

// console.log(hw.next())
// // { value: 'world', done: false }

// console.log(hw.next())
// // { value: 'ending', done: true }

// console.log(hw.next())
// // { value: undefined, done: true }



// function* gen() {
//     yield 123 + 456
// }

// let fn = gen();

// console.log(fn)

// console.log(fn.next())

// yield表达式只能用在 Generator 函数里面，用在其他地方都会报错。

// function* f() {
//     console.log('执行了！')
// }

// var generator = f();

// setTimeout(function () {
//     generator.next()
// }, 2000);

// demo

// var arr = [1, [[2, 3], 4], [5, 6]];

// var flat = function* (a) {
//     var length = a.length;
//     for (var i = 0; i < length; i++) {
//         var item = a[i];
//         if (typeof item !== 'number') {
//             yield* flat(item);
//         } else {
//             yield item;
//         }
//     }
// };

// for (var f of flat(arr)) {
//     console.log(f);
// }


// demo4
// function* foo() {
//     yield 1;
//     yield 2;
//     yield 3;
//     yield 4;
//     yield 5;
//     return 6;
// }

// for (let i of foo()) {
//     console.log(i)
// }


// demo5 
var g = function* () {
    try {
        yield;
    } catch (e) {
        console.log('内部捕获', e);
    }
};

var i = g();
i.next();

try {
    i.throw('a');
    i.throw('b');
    i.throw('c')

} catch (e) {
    console.log('外部捕获', e);
}
  // 内部捕获 a
  // 外部捕获 b
