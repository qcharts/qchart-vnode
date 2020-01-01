import interpolate from './interpolate'
import invariant from './invariant'
invariant
function now() {
  return typeof performance !== 'undefined' ? performance.now() : Date.now()
}

let requestAnimationFrame = window.requestAnimationFrame
let cancelAnimationFrame = window.cancelAnimationFrame
if (!requestAnimationFrame) {
  const startTime = now()
  requestAnimationFrame = fn => {
    return setTimeout(() => {
      fn(now() - startTime)
    }, 16)
  }
  cancelAnimationFrame = id => {
    return clearTimeout(id)
  }
}
const delay = time =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve()
    }, time)
  )
export { now, interpolate, invariant, requestAnimationFrame, cancelAnimationFrame, delay }
