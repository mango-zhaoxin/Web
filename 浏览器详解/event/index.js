const parent = document.getElementById("parent");
const child = document.getElementById("child");
const son = document.getElementById("son");
const baidu = document.getElementById("a-baidu");

console.log(baidu);

baidu.addEventListener('click', function (e) {
  e.preventDefault();
})

// 场景题目：
// 如果现在有一个历史页面，页面上面有居多的按钮，其他元素，都绑定了自己的click事件
// user -> banned, true, alert('你被封禁了！')，阻止原有的click事件的触发
// user -> banned, false, 不做任何的处理

// 1. 在每个click的函数内，都判断一些banned, 如果有10000个click事件怎么办？
// 2. 可以使用装饰器，在装饰器里面统一写判断和拦截的逻辑，然后用装饰器装饰1000个click函数
// 3. 进入页面的时候，判断一下banned, 写一个全屏的透明元素，z - index = 1000;
// 4. 在最外层的元素或者window上面，去绑定事件，做事件流的拦截处理

// e.target：指当前点击的元素, e.currentTarget：指绑定监听事件的元素
// e.target.nodeName 指当前点击的元素, e.currentTarget.nodeName绑定监听事件的元素


window.addEventListener("click", function (e) {
  console.log("window 捕获", e.target.nodeName, e.currentTarget.nodeName);
}, true);

// const banned = true;

parent.addEventListener("click", function (e) {
  // if (banned) {
  //   e.stopPropagation();
  //   window.alert('你被封禁了!')
  //   return;
  // }
  console.log("parent 捕获", e.target.nodeName, e.currentTarget.nodeName);
}, true);

child.addEventListener("click", function (e) {
  console.log("child 捕获", e.target.nodeName, e.currentTarget.nodeName);
}, true);

son.addEventListener("click", function (e) {
  console.log("son 捕获", e.target.nodeName, e.currentTarget.nodeName);
}, true);

window.addEventListener("click", function (e) {
  console.log("window 冒泡", e.target.nodeName, e.currentTarget.nodeName);
}, false);

parent.addEventListener("click", function (e) {
  console.log("parent 冒泡", e.target.nodeName, e.currentTarget.nodeName);
}, false);

child.addEventListener("click", function (e) {
  console.log("child 冒泡", e.target.nodeName, e.currentTarget.nodeName);
}, false);

son.addEventListener("click", function (e) {
  console.log("son 冒泡", e.target.nodeName, e.currentTarget.nodeName);
}, false);