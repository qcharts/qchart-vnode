import { CREATE, REPLACE, UPDATE, REMOVE } from './consts'
import { createElement } from './render'
import { addEvent, addState, addAnimate, addRef } from './nodeHelper'

export function patchAttrs(graph, el, patche) {
  if (!el) {
    return
  }
  if (!Object.keys(patche).length) {
    return
  }
  addRef(graph, el, patche)
  addState(el, patche)
  addEvent(el, patche)
  el.attr(patche)
  addAnimate(graph, el, patche)
}

/**
 * @param {*} parent
 * @param {*} patches
 * @param {*} index
 */
export default function patch(parent, patche, num = 0) {
  //core中调用patch的时候，base中处理绑定this到当前图表
  let i = num
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
      parent.children[i] && parent.children[i].remove()
      break
    }
    case UPDATE: {
      const { attrs, children } = patche
      let curNode = parent.children[i]
      patchAttrs(graph, curNode, attrs)
      //从大到小开始处理，防止remove时i变化
      for (let j = children.length - 1; j >= 0; j--) {
        patch.bind(graph)(curNode, children[j], j)
      }
      for (let m = parent.children.length - children.length; m >= 0; m--) {
        patch.bind(graph)(curNode, children[m], m)
      }
      break
    }
  }
}
