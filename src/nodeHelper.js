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
export function addEvent(graph, el, attrs = {}) {
  graph.__cacheEvent = graph.__cacheEvent || {}
  //缓存方法，修改方法指针this
  Object.keys(attrs).forEach(key => {
    if (!/^on/.test(key)) {
      return
    }
    const type = key.split('on')[1].toLowerCase()
    const cb = attrs[key] || (() => {})
    let newF = evt => cb.call(graph, evt, el)
    el.removeEventListener(type, graph.__cacheEvent[cb])
    el.addEventListener(type, newF)
    graph.__cacheEvent[cb] = newF
    delete attrs[key]
  })
}
