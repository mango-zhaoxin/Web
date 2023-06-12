// scheduler - 调度

// 有多个任务，写一个调度器，有同步任务，有异步任务，按照需求输出对应的内容

// 调度器： 管理任务，按照一定的规则，按照顺序进行输出

// react:
// 1. IDLE - requestIdleCallback(简称为ric)(TODO: 不理解，后续去查) - 执行task
// 放到浏览器的空闲时间去执行，所有的任务，放到每一段的空闲时间去执行，切片处理
// react 为什么没有使用 requestIdleCallback ? -> 兼容性问题，50ms优化问题（最本质的原因）
// 50Hz, 1000/50=20ms， 任务超过20ms没有执行完毕，就会让用户觉得卡顿

// 2. postMessage ?? 
// 为什么使用 messageChannel 而不使用别的？
// eventLoop -> 一句话解释 eventLoop，  微任务是在render之前执行的，宏任务是在render之后执行的（下一个tick）
// setTimeout也是宏任务，为什么不使用？间隔时间不相等，越到后面，间隔时间4,5秒，影响很大

// 3. 为什么不使用generator去实现scheduler? ---> 内部是有状态的，中断了还得重新开始，很麻烦
// web worker 结构化克隆（是深度克隆）（web worker、history api、）

// scheduler
/**
 * 1. schedule -> 把任务放进一个队列，然后开始（以某种节奏[ric(requestIdleCallback)]执行）
 *    -> 还可以拆分为：两步， pushTask（放进去）， schedule（执行）
 * 
 * 2. shouldYield -> should yield -> generator yield（本质上，就是返回 true/false 的函数）
 * （向外界暴露一个方法，让外界知道知道是可以接着继续执行，还是终止）
 */

const queue = [];
const threshold = 1000 / 60;

// git transtions
const transtions = [];
const deadline = 0; // 计时

const now = () => performance.now();
const peek = arr => arr[0];

export function shouldYield() {
  return navigator.scheduling.isInputPending() || now() >= deadline
}

// 触发一个宏任务，在nextTick里面把transtions里面的东西取出来跑一下
const postMessage = (() => {
  const cb = () => transtions.splice(0, 1).forEach(c => c());
  const { port1, port2 } = new MessageChannel();
  port1.onmessage = cb;
  return () => port2.postMessage(null)
})()


export function startTranstion(cb) {
  transtions.push(cb) && postMessage()
}

// 二合一， push/exec
export function scheduler(cb) {
  queue.push({ cb })
  startTranstion(flush)
}

function flush() {
  deadline = now() + threshold;
  let task = peek(queue); // 调和

  // 存在 task并且有时间
  while (task && !shouldYield()) {
    const { cb } = task;
    task.cb = null;
    const next = cb() // 把任务取出来

    if (next && typeof next === 'function') { // 如果任务是一个函数，更新任务 task 里面的回调函数
      task.cb = next
    } else { // 如果返回的是 null undefined，或者不是上面的函数，就认为任务是执行完毕的，直接清除任务
      // 清除任务
      queue.shift()
    }

    // 接着去清空队列
    task = peek(queue)
  }

  // TODO: 执行任务
  task && startTranstion(flush)

}





