const vm = require('vm');
const path = require('path');
const fs = require('fs');

function customRequire(filename) {
  const pathToFile = path.resolve(__dirname, filename) // 读取文件名
  const content = fs.readFileSync(pathToFile, 'utf-8'); // 通过文件名，读取到文件内容字符串

  // 包裹成为一个函数
  const wrapper = [
    '(function(require, module, exports) {', // 也可以注入多个内容'(function(require, module, exports, _dirname, __filename) {'
    '})'
  ]

  // 包裹成为的函数主体内容
  const wrappedContent = wrapper[0] + content + wrapper[1];

  const script = new vm.Script(wrappedContent, {
    filename: 'index.js'
  })

  const module = {
    exports: {}
  }

  const result = script.runInThisContext(); // 把字符串变成一个函数
  result(customRequire, module, module.exports); // 把require, module, exports三个变量注入到函数里面
  return module.exports;
}

global.r = customRequire;