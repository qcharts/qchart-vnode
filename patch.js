import { CREATE, REPLACE, UPDATE, REMOVE } from './consts'
import { createElement } from './render'
import { addEvent, resolveStyle, addAnimate, applyRef } from './nodeHelper'

export function patchAttrs(graph, el, patche) {
  if (!el) {
    return
  }
  if (!Object.keys(patche).length) {
    return
  }
  applyRef(graph, el, patche)
  // resolveStyle(el, patche)
  addEvent(el, patche)
  el.attr(patche)
  addAnimate(graph, el, patche)
}

/**
 * @param {*} parent
 * @param {*} patches
 * @param {*} index
 */
export default function patch(parent, patche, i = 0) {
  //core中调用patch的时候，base中处理绑定this到当前图表
  let graph = this
  if (!patche || !parent) {
    return
  }
  switch (patche.type) {
    case CREATE: {
      const { newVNode } = patche
      const newEl = createElement.bind(graph)(newVNode)
      newEl && parent.appendChild(newEl)
      break
    }
    case REPLACE: {
      const { newVNode } = patche
      const newEl = createElement(newVNode)
      parent.replaceChild(newEl, el)
      break
    }
    case REMOVE: {
      parent.children[i].remove()
      break
    }
    case UPDATE: {
      const { attrs, children } = patche
      patchAttrs(graph, parent.children[i], attrs)
      for (let i = 0, len = children.length; i < len; i++) {
        patch.bind(graph)(parent.children[i], children[i], i)
      }
      break
    }
  }
}
