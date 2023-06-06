问题： 小程序的接口如何做 promise 化？

安转 Promise wx-promise-pro

问题：如果在不使用框架、库的情况下，如何手写封装一个promise化的接口？

做法： 重写request, 使用promise进行包裹

```js
function request(opt) {
  return new Promise((resolve, reject) => {
    wx.request({
      ...opt,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

// 函数科里化
function promisify(api) {
  return (opt = {}) => {
    return new Promise((resolve, reject) => {
      api({
        ...opt, 
        success: resolve,
        fail: reject,
      })
    })
  }
}
promisify(wx.request)(opt)
```

列表页面
搜索组件
列表组件