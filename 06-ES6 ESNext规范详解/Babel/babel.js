const myPlugin = require('./plugin');
const babel = require('@babel/core');
const content = 'const name = lubai';

// 通过你编写的插件输出的代码
const {
  code
} = babel.transform(content, {
  plugins: [
    myPlugin
  ]
})

console.log(code);