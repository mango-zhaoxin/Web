// 一、xhr 请求讲解
// 先注册事件（xhr.onreadystatechange ）, 再去发送请求（xhr.send()

let xhr = new XMLHttpRequest();
xhr.open('GET', 'http://domain/service');

// request state change event
xhr.onreadystatechange = function () {
  // request completed?
  if (xhr.readyState !== 4) return;

  if (xhr.status === 200) {
    // request successful - show response
    console.log(xhr.responseText);
  } else {
    // request error
    console.log('HTTP error', xhr.status, xhr.statusText);
  }
};

xhr.timeout = 3000; // 3 seconds 多久之后算作超时
xhr.ontimeout = () => console.log('timeout', xhr.responseURL);

// progress事件可以报告长时间运行的文件上传（进度）
xhr.upload.onprogress = p => {
  console.log(Math.round((p.loaded / p.total) * 100) + '%');
}

// start request
xhr.send();



// 二、fetch请求讲解

// fetch 常用在node层次，前端请求也常用
// node-feach
// axios
// adapator

fetch('http://domain/service', { method: 'GET' })
  .then(response => response.json())
  .then(json => console.log(json))
  .catch(error => console.error('error:', error));


// 特性1：默认不带cookie

fetch('http://domain/service', {
  method: 'GET',
  credentials: 'same-origin' // 设置了这个参数之后，可以携带cookie
})


// 特性2：错误不会reject

// HTTP错误（例如404 Page Not Found 或 500 Internal Server Error）不会导致Fetch返回的Promise标记为reject；.catch()也不会被执行。
// 想要精确的判断 fetch是否成功，需要包含 promise resolved 的情况，此时再判断 response.ok是不是为 true

fetch('http://domain/service', {
  method: 'GET'
})
  .then(response => {
    // 404, 500 会进入 .then
    if (response.ok) {
      // 请求成功 200，201
      return response.json();
    }
    throw new Error('Network response was not ok.');
  })
  .then(json => console.log(json))
  .catch(error => console.error('error:', error));


// 特性3：不支持直接设置超时, 可以用promise

function fetchTimeout(url, init, timeout = 3000) {
  return new Promise((resolve, reject) => {
    fetch(url, init)
      .then(resolve)
      .catch(reject);
    setTimeout(reject, timeout);
  })
}

// fetch 和 setTimeout 是同步的，执行的开始时间是相同的，所以哪个状态先返回，就会先改变 Promise 的状态，而 Promise 的状态一旦被改变的话，就不能够被再次改变了
// 正常的情况，不超时的情况：如果3秒之后，fetch 的请求成功的返回了，那么就会去改变 Promise 的状态，不管是请求是成功还是失败，Promise 的状态一定会被改变成为 fulfilled 或者 rejected, 3秒之后定时器超时执行了，Promise状态也不会被重新改变
// 超时的情况：如果过了3秒钟之后，接口一直没有返回结果，那么就会先去执行定时器里面的 reject, 把 Promise 的状态改变为 rejected，在这之后，就算接口成功返回来了，这时候，Promise 的状态也不会被重新改变

// 小作业：大家可以回去尝试着写一个比较通用的，针对异步的超时处理函数
// TODO 待完善
// function fetchTimeout(asyncFn, timeout = 3000) {
//   return new Promise((resolve, reject) => {
//     asyncFn(() => { })
//     setTimeout(reject, timeout);
//   })
// }



// 特性4：中止fetch

const controller = new AbortController();

fetch('http://domain/service', {
  method: 'GET',
  signal: controller.signal
})
  .then(response => response.json())
  .then(json => console.log(json))
  .catch(error => console.error('Error:', error));

controller.abort();

// 举例子：平时发邮件，一不小心发出去了，撤回操作