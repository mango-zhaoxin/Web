import axios from 'axios';

export let token = null;

let getTokenPromise = null;

export const getToken = () => {
  if (!getTokenPromise) {
    getTokenPromise = axios.get('/api/token').then(res => {
      token = res.data.token;
      return token;
    })
  }

  return getTokenPromise;
}

export function throttle(func, timeout = 1000) {
  let done = false;
  return (...args) => {
    if (!done) {
      func.call(this, ...args);
      done = true;
      setTimeout(() => {
        done = false;
      }, time)
    }
  }
}

export const decoratorThrottle = (timeout = 1000) => {
  return (targetPrototype, propName) => {
    const oldMethod = targetPrototype[propName];
    let lastActionTime = 0;
    targetPrototype[propName] = function (...args) {
      const currentTime = Date.now();

      if (currentTime - lastActionTime > timeout) {
        oldMethod.call(this, ...args);
        lastActionTime = currentTime
      }
    }

    return targetPrototype;
  }
}