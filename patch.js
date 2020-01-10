import { CREATE, REPLACE, UPDATE, REMOVE } from './consts'
import { createElement } from './render'
import { delegateEvent, resolveStyle, animate, applyRef } from './nodeHelper'

const patchAttrs = (el, patche) => {
  if (!el) {
    return
  }
  if (!Object.keys(patche).length) {
    return
  }
  // applyRef(el, patche)
  // resolveStyle(el, patche)
  // delegateEvent(el, patche)
  el.attr(patche)
  //animate(el, patche)
}
/**
 * @param {*} parent
 * @param {*} patches
 * @param {*} index
 */
export default function patch(parent, patche, i = 0) {
  if (!patche || !parent) {
    return
  }
  /* eslint-disable indent */
  switch (patche.type) {
    case CREATE: {
      const { newVNode } = patche
      const newEl = createElement(newVNode)
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
      patchAttrs(parent.children[i], attrs)
      for (let i = 0, len = children.length; i < len; i++) {
        patch(parent, children[i], i)
      }
      break
    }
  }
}
