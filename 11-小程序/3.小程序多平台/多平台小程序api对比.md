### 支付宝小程序 & 微信小程序
#### 一、 app.json
#### (1) 小程序的通用设置：状态栏、导航条、标题、窗口背景色
* 微信
```js
  window: {
      "backgroundTextStyle": "light",
      // ……
  }
```

* 支付宝
```js
  window: {
      "default": "light",
      // ……
  }
```

#### (2)tabBar
* 区别
```js
  tabBar: {
      // 支付宝
      items: [],
      // 微信
      list: []
  }
```

### 二、pages
#### （1）文件名
* 支付宝: axml + acss
* 微信： wxml + wxss

#### (2) 视图页面axml、wxml
#### a. 事件
* 支付宝 onTap\catchTap
* 微信 bindtap\catchtouchstart

#### b. 列表的渲染
* 支付宝
```js
  a:for="{{list}}"

  key="item-{{index}}" index="index"
```

* 微信
```js
  wx:for="{{list}}"

  wx:key="key" wx-for-item="item"
```

#### c. 条件渲染
* 支付宝
```js
  a:if
  a:else
  a:esleif
```

* 微信
```js
  wx:if
  wx:else
  wx:esleif
```

### 三、组件的不同
#### 1. showToast
* 支付宝
```js
  my.showToast({

  })
```

* 微信
```js
  wx.showToast({

  })
```

#### 2. showLoading
```js
  my.showLoading({

  })
```

* 微信
```js
  wx.showLoading({

  })
```

#### 3. request网络请求
* 支付宝
```js
my.httpRequest({
    url: '',
    method: '',
    data: {},
    header: '',
    dataType: '',
    success: function() {},
    fail: function() {}
})
```

* 微信
```js
wx.request({
    url: '',
    method: '',
    data: {},
    header: '',
    dataType: '',
    success: function() {},
    fail: function() {}
})
```

#### 4. 支付
* 支付宝
```js
  my.tradePay({
      tradeNO: '47983279478923797057247185',
      success: res => {},
      fail: res => {}
  })
```

* 微信
```js
  wx.requstPayment({
      package: 'pre_pay_id',
      signType: 'MD5',
      paySign: '',
      success: res => {},
      fail: res => {}
  })
```

#### 5. 获取code
* 支付宝
```js
my.getAuthCode({
    success() {
    }
})
```
* 微信
```js
wx.login({
    success() {}
})
```
