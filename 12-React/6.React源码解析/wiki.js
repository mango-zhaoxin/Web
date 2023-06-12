// 1. useTransition API
// startTransition 👉 https://github.com/reactwg/react-18/discussions/41
// https://github.com/reactwg/react-18/discussions/65

// 2. Scheduler / why not generator ? why web-worker ?
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator
// [why not use generator] https://github.com/facebook/react/issues/7942#issuecomment-254987818

// why not setTimeout? why not raf? 
// https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel
// [event-loop] https://www.youtube.com/watch?v=u1kqx6AenYw&t=853s
// https://www.imaginea.com/the-javascript-event-loop-micro-tasks-and-macro-tasks/

// -----task queue -----| ----- micro-tasks ------| -------render --------| --------macro-tasks--------|
// https://image-static.segmentfault.com/165/372/1653721873-5adb68e2247cf

// inputing
// https://github.com/WICG/is-input-pending
// [idle] https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback