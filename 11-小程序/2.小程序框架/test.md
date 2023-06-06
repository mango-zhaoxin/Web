借鉴了vue语法功能，支持vue书写特征 - vue技术友好行

### 一、生命周期（同原生小程序）
#### 应用周期
* onLaunch 首次打开
* onShow 初始化完成
* onHide 切换

#### 页面周期
* onLoad 加载页面
* onShow 前后台切换
* onHide 前后台切换
* onUnLoad 重定向 / 路由切换
* onPullDownRefresh 下拉
* onReachBottom 上拉
* onShareAppMessage 分享
* ……


#### 问题
#### 1. 简单说说小程序生命周期
#### 2. double thread运行机制
* view thread + appService thread
* notify、 sendData 对应周期

################################################

### 二、 数据层 - 数据绑定
#### 原生小程序
```js
this.setData({label: 'label'});
```

#### wepy
```js
this.label = 'label1';
```

#### 1. 如何做到侦听数据改变，多次setData时候，通信的次数是一次还是多次？
* 在一次渲染周期内，收到多次setData的话，只会渲染一次
* jscore -> native -> webview

#### 2. 渲染周期 -> 如何优化小程序数据通信，提升页面性能
* 减少setData的调用，合并多个setData
* 与界面渲染无关的数据最好不要设置在data
* 有些数据不在页面中展示，包含复杂数据结构或者超长字符串，则不应该使用setData来设置这些数据


#### 3. 还有其他哪些地方是可以放置无关数据

#### 4. 为什么data设置长字符串，不显示也会影像页面性能
* evaluateJavascript? 长数据

#### 5. wepy 如何做数据绑定优化的
* wepy内部实现了一个脏数据检查机制，函数执行完成之后 -> data-check
* newValue 和 oldValue做比较，如果有变化，就会加入到readyToSet的队列中，最后统一做一个setData
* 同一时间只允许一个脏值检查流程进行

#### 6.wepy中异步数据如何更新
* $apply()
```js
setTimeout(() => {
    this.label = 'label';
    this.$apply();
})
```

#########################################################

### 三、文件分布
#### wepy 主文件 .wpy => style + template + script

##########################################################

### 四、网络层 - 网络请求 (原生wx.request)
#### wepy有一套自建的api拦截器

```js
// config + success + fail + complete
this.intercept('request', {
    config() {},
    success() {}
})
```

#### 1. 项目中如何拦截请求做预处理（额外增加请求参数、增加时间戳）

#### 2. 请求返回后如何对数据进行加工（判断超时、返回参数增加）

#############################################################

### 五、结构层 - mixin混合
#### wepy实现了同vue一样，可以复用抽离的方式
* 默认式混合 - data/components
1. page和mixin都定义了参数a, 看page
2. mixin中定义了，page中未定义的变量b，看mixin

* 兼容式混合 - methods
1. 先响应组件本身的事件，再相应mixin中的事件

#### 1. （事件）响应顺序是如何的？
* mixin事件的响应顺序和vue是相反的，vue：先执行mixin函数，再执行组件本身函数
* 兼容性混合中，先响应了组件本身，在响应混合事件

###############################################################

### 六、结构层 - 组件
#### wepy的组件化 < = > js原生模块化
* bindtap = "handleClick" 模板a和模板b童海洋都绑定了click方法，不利于后期维护

```js
a.wpy
  - data: {d: d}
  - methods: m()

b.wpy
  - data: {d: d}
  - methods: m()

// compile
a.wxml + a.wxss + a.js
  - data: $a.$d
  - methods: $a.$m()

b.wxml + b.wxss + b.js
  - data: $b.$d
  - methods: $b.$m()

```

* import引入，components
* 实现了循环module <repeat for="{{ list }}">
* computed, watcher, props, $broadcast, $emit, slot

#### 1. wepy如何实现的组件化（如上）
#### 2. wepy组件有何特殊性 or wepy组件化过程中框架的不足
* wepy中的组件都是 静态组件 => 组件Id唯一标识一个组件实例 => 在同一个页面中无法独立引用多个相同id的组件

```js
// error
<template>
  <view>
      <comp></comp>
  </view>
  <view>
      <comp></comp>
  </view>
</template>
<script>
    import comp from './comp';
    // ……
</script>

// ok
<template>
  <view>
      <comp></comp>
  </view>
  <view>
      <newComp></newComp>
  </view>
</template>
<script>
    import comp from './comp';
    // ……
    // {
    //    comp: comp,
    //    newComp: comp
    // }
</script>
```
#### 3. list循环渲染 or repeat循环有何不足
* 不支持在repeat中使用props、computed、watch等
```js
// error
// list.wpy
<view>{{ item.name }}</view>

// index.wpy
<repeat for="{{ list }}">
    <list :item.sync="item">
</repeat>

// ok
// list.wpy
<repeat for="{{ list }}">
    <view>{{ item.name }}</view>
</repeat>

// index.wpy
<list :item.sync="item">

// 原因还是静态组件

########################################################
七、源码分析
##### 源码结构
1. 编译流程
```js
// 入口
// wepy-cli/src/compile.js
```
适配器 - adapter
node => newNode

2. 数据同步实际代码的实现
```js
components.js
wepy.js

$$phase - 是否有脏值检查正在运行
$apply - 应用更新（1. 通过phase做状态检查 2. 调用$digest做值统一更新）
$digest - 遍历originData，做脏值对比，如果值有更新，放到readyToSet。循环之后统一调用setData
```
