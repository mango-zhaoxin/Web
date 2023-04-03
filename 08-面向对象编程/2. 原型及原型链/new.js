// 问题：new函数主要做了什么？
// 1. 一个继承自 Player 的新对象 p1 被创建了。
// 2. p1.**proto** = Player.prototype，p1 的**proto**指向 Player 的原型对象
// 3. 将 this 指向新创建的对象 p1
// 4. 返回这个新对象 p1

function Player(name) {
  this.name = name;
}

function objectFactory() {
  let o = new Object();

  let FunctionConstructor = [].shift.call(arguments);
  o.__proto__ = FunctionConstructor.prototype;

  let resultObj = FunctionConstructor.apply(o, argument);
  return typeof resultObj === 'object' ? resultObj : o
}

const p1 = objectFactory(Player, 'mango')

console.log(p1);