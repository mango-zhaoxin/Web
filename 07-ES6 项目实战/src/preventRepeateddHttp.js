import axios from 'axios';

const pendingMap = new Map();

export const addPendingRequest = (config) => {
  const { url, method } = config;
  const mapKey = [url, method].join('&');

  if (pendingMap.has(mapKey)) {
    const cancel = pendingMap.get(mapKey);
    cancel(mapKey);
    pendingMap.delete(mapKey);
  }

  config.cancelToken = new axios.CancelToken(cancel => {
    pendingMap.set(mapKey, cancel)
  })
}

export const deletePendingRequest = (config) => {
  const { url, method } = config;
  const mapKey = [url, method].join('&');

  pendingMap.delete(mapKey);
}