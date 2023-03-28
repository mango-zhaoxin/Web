// 定义math.js模块
define(function () {
  var baseNum = 0;
  var add = function (x, y) {
    return x + y;
  };
  return {
    add: add,
    baseNum: baseNum
  };
})

// 定义underscore模块
define(['underscore'], function (_) {
  var classify = function (list) {
    _.countBy(list, function (num) {
      return num > 30 ? 'old' : 'young';
    })
  };

  return {
    classify: classify
  }
})

require(['jquery', 'math'], function ($, math) {
  var sum = math.add(10, 20);
  $('#sum').html(sum)
})

