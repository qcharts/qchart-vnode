import { Tween } from '../tween'
import { deepObjectMerge } from '@qcharts/utils'
import filterClone from 'filter-clone'

/**
 * 为 spritejs 元素添加动画
 * @param {*} el
 * @param {*} attrs
 */
export function addAnimate(graph, el, attrs) {
  if (!el || !attrs.animation) {
    return
  }
  const animation = deepObjectMerge(graph.renderAttrs.animation, attrs.animation)
  // const animation = {
  //   delay: 0,
  //   duration: 300,
  //   useTween: false,
  //   ...attrs.animation
  // }

  const { from, middle, use, to, delay, duration, useTween, formatter = d => d } = animation

  if (!from || !to || !use) {
    return
  }

  let ani = filterClone(animation, null, ['from', 'to', 'formatter', 'use'])

  const setAnimation = () => {
    if (!useTween) {
      let keys = null
      if (middle) {
        keys = [from, middle, to]
      } else {
        keys = [from, to]
      }
      el.animate(keys, {
        fill: 'both',
        ...ani
      }).finished.then(() => {
        delete to.offset
        el.attr(to)
      })
    } else {
      new Tween()
        .from(from)
        .to(to)
        .delay(delay)
        .duration(duration)
        .onUpdate(attr => {
          el.attr(formatter(attr))
        })
        .start()
    }
  }
  setAnimation()
}

/**
 * 为 spritejs 元素设置 诸如`normal` 、`hover`  style
 * 通过将 `style` 转换为 `states`
 * 使得开发可以直接通过 `el.attr('state', 'hover')` 来切换样式
 * @param {*} el
 * @param {*} attrs
 */
export function addState(el, attrs) {
  const normal = Object.create(null)
  let cloneNode = null

  let initialStates = { normal, ...(attrs.states || {}) }

  delete attrs.states

  let states = Object.keys(attrs).reduce((a, key) => {
    if (!/\S+state$/i.test(key)) {
      return a
    }

    let inputState = attrs[key]

    if (!inputState || typeof inputState !== 'object') {
      return a
    }

    const stateName = key.slice(0, -5)

    if (!cloneNode) {
      cloneNode = el.cloneNode()
    }

    cloneNode.attr(inputState)

    const currentAttrs = cloneNode.attr()
    Object.keys(inputState).forEach(k => {
      inputState[k] = currentAttrs[k]
    })

    const originAttrs = Object.assign({}, el.attr(), attrs)

    Object.keys(inputState).forEach(key => {
      if (!(key in originAttrs)) {
        console.warn(`Set invalid attribute '${key}' to ${el.nodeName}.`)
        normal[key] = inputState[key]
      } else {
        normal[key] = originAttrs[key]
      }
    })

    a[stateName] = inputState
    delete attrs[key]
    return a
  }, initialStates)

  el.attr({ state: 'normal', states })
}

/**
 * ref 回调函数
 * @param {*} el
 * @param {*} attrs
 */
export function addRef(graph, el, attrs) {
  const ref = attrs.ref
  delete attrs.ref
  if (ref && el) {
    try {
      graph.addRef(ref, el)
    } catch (e) {
      console.error(e)
    }
  }
}

/**
 * 为 spritejs 元素添加事件
 * @param {*} el
 * @param {*} attrs
 */
export function addEvent(el, attrs = {}) {
  Object.keys(attrs).forEach(key => {
    if (!/^@/.test(key)) {
      return
    }
    const type = key.split('@')[1].toLowerCase()
    const cb = attrs[key] || (() => {})
    el.off(type)
    el.on(type, evt => cb.bind(el)(evt))
    delete attrs[key]
  })
}
