import { CREATE, REPLACE, UPDATE, REMOVE } from './consts'
import { createElement } from './render'
import { addEvent, addState, addAnimate, addRef } from './nodeHelper'

export function patchAttrs (graph, el, patche) {
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
export default function patch (parent, patche, num = 0) {
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
      //对应的dom与vnode打上对应的ind，防止remove与create的时候变动i
      parent.children.forEach((child, ind) => {
        child._ind = ind;
      })
      children.forEach((child, ind) => {
        child._ind = ind;
      })
      let curNode = parent.children.filter(child => child._ind === i)[0]
      patchAttrs(graph, curNode, attrs)
      let len = children.length > parent.children.length ? children.length : parent.children.length
      for (let j = 0; j < len; j++) {
        patch.bind(graph)(curNode, children.filter(child => child._ind === j)[0], j)
      }
      break
    }
  }
}
