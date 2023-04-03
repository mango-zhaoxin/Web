function Parent() {
  this.name = "ParentName";
  this.action = ['sing', 'jump', 'rap'];
}

function Child() { };

Child.prototype = new Parent();
Child.prototype.constructor = Child;

const c1 = new Child();
c1.action.push('basketball');
console.log(c1.action); // [ 'sing', 'jump', 'rap', 'basketball' ]

const c2 = new Child();
console.log(c2.action); // [ 'sing', 'jump', 'rap', 'basketball' ]