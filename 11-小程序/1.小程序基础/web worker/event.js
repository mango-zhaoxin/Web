// TODO: 观察者模式和发布订阅模式的区别？

// 发布订阅：a = middle  = b, c
// middle 相当于一个调度站

// 观察者模式
// a = b 
// a = c

// 实现一个观察者模型
class Event {
  constructor(name) {
    this.name = name;
    this.observers = {};
    // this.on = this.on.bind(this);
    // this.emit = this.emit.bind(this);
  }

  on = (type, fn) => {
    // fn为什么要写到数组里面？
    // fn: 触发的事件，张三买可乐，李四买雪碧，都用fn来记
    if (this.observers[type]) {
      this.observers[type].push(fn);
    } else {
      this.observers[type] = [fn];
    }
  }

  emit = (type, opt) => {
    this.observers[type].map(item => {
      item(opt)
    })
  }
}

// const events = new Event();

// events.on('buy', (value) => {
//     console.log('我去买东西', value.name)
// })

// events.on('go', () => {
//     console.log('我走了')
// })

// events.emit('buy', { name: '可乐' })
// events.emit('buy', { name: '雪碧' })