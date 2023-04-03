function Parent(name, action) {
  this.name = name;
  this.action = action;
}

Parent.prototype.getName = function () {
  console.log(this.name + '调用了getName');
}

function Child() {
  Parent.apply(this, arguments);
}

Child.prototype = Object.create(Parent.prototype);

const c1 = new Child('c1', ['eat']);
const c2 = new Child('c2', ['run']);