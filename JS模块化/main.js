{/* <script src="js/require.js" data-main="js/main"></script> */ }

require.config({
  baseUrl: 'js/lib',
  paths: {
    'jquery': 'jquery.min',
    'underscore': 'underscore.min'
  }
})

require(['jquery', 'underscore'], function ($, _) {
  // 逻辑代码
})