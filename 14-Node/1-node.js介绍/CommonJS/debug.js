let index = 0;
let cache = {
  method: function () {
    console.log('this is cache', index);
  }
}

function cacheInfo(info) {
  index++;
  const prevCache = cache;
  const method = function () {
    if (prevCache) {
      prevCache.method()
    }
  }

  cache = {
    info: info,
    method() {
      method();
      console.log('this is method', index);
    }
  }
}

for (var i = 0; i < 10000000; i++) {
  const info = new Array(100000000);
  cacheInfo(info)
}