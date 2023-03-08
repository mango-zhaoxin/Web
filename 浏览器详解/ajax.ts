type AjaxType = 'GET' | 'POST' | 'PUT' | "DELETE"

interface IOptions {
    url: string;
    type?: AjaxType;
    data: any;
    timeout?: number;
}

function formatUrl(json) {
    let newJson = {...json}
    let dataArr = [];
    newJson.t = Math.random() + Date.now(); // 特殊值：有助于追踪请求，比如某个请求报错了，根据这样一个特殊的值就很容易的追踪到
    for (let key in json) {
        dataArr.push(`${key}=${encodeURIComponent(json[key])}`)
    }
    return dataArr.join('&');
}

export function ajax(
  options: IOptions = {
      type: "GET",
      timeout: 3000,
      url: "",
      data: {}
  } 
) {
    return new Promise((resolve, reject) => {
        if (!options.url || !options.data) {
          return;
        }
    
        let dataToUrlstr = formatUrl(options.data); // QueryString 形式的参数
        let timer;
    
        // 1.创建
        let xhr;
        if ((window as any).XMLHttpRequest) {
            // 如果存在，直接使用
            xhr = new XMLHttpRequest();
        } else {
            // 如果不存在，创建一个新的
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
    
        if (options.type.toUpperCase() === 'GET') {
            // 2.连接
            xhr.open('get', `${options.url}?${dataToUrlstr}`, true);
            // 3.发送
            xhr.send();
        } else if (options.type.toUpperCase() === 'POST') {
            // 2.连接
            xhr.open('post', options.url, true);
            xhr.setRequestHeader('ContentType', 'application/x-www-form-urlencoded');
            // 3.发送
            xhr.send(options.data);
        }
    
        // 4.接收
        // 10s 超时，请求 1s 完成
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (timer) {
                  clearTimeout(timer);
                  timer = null;
                }
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr.status);
                }
            }
        }
    
        if (options.timeout) {
            timer = setTimeout(() => {
                xhr.abort();
                reject('超时');
            }, options.timeout)
        }

        // xhr.timeout = options.timeout;
        // xhr.ontimeout = () => {
        //     reject('超时');
        // }
    });
}

// timer赋值出来的作用 - 考虑内存
// 如果没有超时，但是定时器已经在执行了，如果在超时的时间之内完成了，虽然 Promise 的状态已经被改变了，但是定时器依旧还在执行
// 比如说：10s请求超时，虽然请求1s就完成了， Promise 的状态也已经被改变了，reject已经执行了，但是定时器依旧还在继续执行，10s之后才会结束


