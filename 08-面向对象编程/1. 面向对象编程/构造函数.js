function Player() {
  this.color = 'red';
  this.start = function () {
    console.log(this.color);
  }
}

const p1 = new Player();
const p2 = new Player();

console.log(p1.start === p2.start);
// false


// ChatGPT举例

// 定义一个构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.greet = function () {
    console.log("Hi, I'm " + this.name + " and I'm " + this.age + " years old.");
  }
}

// 创建一个Person对象
var person1 = new Person("Alice", 30);

// 调用Person对象的greet方法
person1.greet(); // 输出 "Hi, I'm Alice and I'm 30 years old."

// 在这个例子中，我们定义了一个Person构造函数，它有两个参数：name和age。在构造函数中，我们使用this关键字来创建一个新对象，并设置其name和age属性。我们还在构造函数中定义了一个greet()方法，该方法用于打印一条消息，包含name和age属性的值。

// 然后，我们使用new关键字来创建一个Person对象，并将其分配给person1变量。最后，我们调用person1对象的greet()方法来输出打招呼的消息。