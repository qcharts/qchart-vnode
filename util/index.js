import interpolate from './interpolate'
import invariant from './invariant'

function now() {
  return typeof performance !== 'undefined' ? performance.now() : Date.now()
}

let requestAnimationFrame, cancelAnimationFrame
if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
  requestAnimationFrame = window.requestAnimationFrame
  cancelAnimationFrame = window.cancelAnimationFrame
} else {
  const startTime = now()
  requestAnimationFrame = (fn) => {
    return setTimeout(() => {
      fn(now() - startTime)
    }, 16)
  }
  cancelAnimationFrame = (id) => {
    return clearTimeout(id)
  }
}
const delay = (time) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve()
    }, time)
  )
export { now, interpolate, invariant, requestAnimationFrame, cancelAnimationFrame, delay }
