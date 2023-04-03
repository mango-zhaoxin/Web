function Parent(name, color) {
  this.name = name;
  this.color = color;
  this.action = ['sing', 'jump', 'rap'];
  this.eat = function () { };
}

function Child() {
  Parent.call(this, arguments);
}

const c1 = new Child('c1', 'red');
const c2 = new Child('c2', 'white');

console.log(c1.eat === c2.eat); // false