class BomEvent {
  constructor(element) {
    this.element = element;
  }

  addEvent(type, handler) {
    if (this.element.addEventListener) {
      //事件类型、需要执行的函数、是否捕捉
      this.element.addEventListener(type, handler, false);
    } else if (this.element.attachEvent) {
      this.element.attachEvent('on' + type, function () {
        handler.call(element);
      });
    } else {
      this.element['on' + type] = handler;
    }
  }

  removeEvent(type, handler) {
    if (this.element.removeEventListener) {
      this.element.removeEventListener(type, handler, false);
    } else if (element.datachEvent) {
      this.element.detachEvent('on' + type, handler);
    } else {
      this.element['on' + type] = null;
    }
  }
}

// 阻止事件 (主要是事件冒泡，因为IE不支持事件捕获)
function stopPropagation(ev) {
  if (ev.stopPropagation) {
    ev.stopPropagation(); // 标准w3c
  } else {
    ev.cancelBubble = true; // IE里面不支持事件捕获，这里是取消冒泡
  }
}

// 取消事件的默认行为
function preventDefault(event) {
  if (event.preventDefault) {
    event.preventDefault(); // 标准w3c
  } else {
    event.returnValue = false; // IE
  }
}