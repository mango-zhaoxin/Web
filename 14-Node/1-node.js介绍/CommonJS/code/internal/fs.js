const fs = require('fs');
const path = require('path');

// 读取文件
const pathToFile = path.resolve(__dirname, './text');

function promisify(func) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      args.push(function (err, result) {
        if (err) return reject(err)
        return resolve(result)
      });
      return func.apply(func, args)
    })
  }
}

const readFileAsync = promisify(fs.readFile)

readFileAsync(pathToFile, 'utf-8')
  .then(content => console.log(content))
  .catch(e => console.log(e))