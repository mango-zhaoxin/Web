// 渲染层

const worker = new Worker('./worker.js');
const MEvent = new Event('main');
const msg = {
  data: 'hello zhaoxin',
  eventType: undefined,
  isInit: true,
  id: undefined
}

// 事件触发函数
function trick(type, id) {
  msg.eventType = type;
  msg.id = id.id;
  trickPostMsg()
};

const trickEvent = (type, opt) => {
  switch (type) {
    case 'addDom':
      MEvent.emit('addDom', opt)
      break;
    case 'changeDom':
      MEvent.emit('changeDom', opt)
      break;
    case 'endInit':
      MEvent.emit('endInit', opt)
      break;
  }
}

function setDom(data) {
  const { id, mytemplate } = data;
  if (document.getElementById(`${id}`)) {
    document.getElementById(`${id}`).innerHTML = mytemplate;
  } else {
    const script = document.createElement('script');
    const div = document.createElement('div');
    div.id = id + '-warper';
    script.id = id;
    script.type = 'text/html';
    script.innerHTML = mytemplate;
    document.body.appendChild(div);
    document.body.appendChild(script);
  }
  document.getElementById(`${id}-warper`).innerHTML = template(mytemplate, data.data);
}

// 结束初始化事件
MEvent.on('endInit', (data) => {
  msg.isInit = false;
  data.map(item => {
    setDom(item)
  })
})

// 添加DOM事件
MEvent.on('addDom', (dom) => {
  const app = document.querySelector('#app');
  let parser = new DOMParser();
  let doc = parser.parseFromString(dom, 'text/html');
  let node = doc.getElementsByTagName('div')[0];
  app.appendChild(node)
})

// 改变DOM事件
MEvent.on('changeDom', (data) => {
  setDom(data);
})

// 监听事件
// 或者可以使用 onMessage 来监听事件
worker.onmessage = function (e) {

  console.log('渲染层数据', e.data)
  trickEvent(e.data.type, e.data.opt)
}

// 触发事件，传递信息给Worker
function trickPostMsg() {
  worker.postMessage(msg)
}

trickPostMsg()