// exports.key = 'hello word';

// exports.kye2 = 'hello key2';

// module.exports = 'hello word'

// exports  = 'hello worlds'; // 不能导出

const obj = {
  key: {}
}

// 两种改变key值的方式：
// 1. 直接赋值：
// obj.key = 'hello word'

// 2. 把obj.key赋值给一个变量，通过修改这个变量的属性进行赋值操作
var key = obj.key
key.key1 = 'hello world'

console.log(obj);