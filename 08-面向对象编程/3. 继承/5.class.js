class Parent {
  constructor() {
    this.name = 'parent';
  }

  getName() {
    console.log(this.name + ' ' + 'getName');
  }
}

class Child extends Parent {
  constructor() {
    super();
  }
}

const p1 = new Child();
p1.getName(); // parent getName