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
  addEvent(graph, el, patche)
  el.attr(patche)
  addAnimate(graph, el, patche)
}

/**
 * @param {*} $el 当前的真实spritejs 节点
 * @param {*} patches 虚拟节点
 * @param {*} isRoot 是否是初节点，用于绑定$el与visual或者plugin
 */
export default function patch($el, patche, isRoot = 0) {
  //core中调用patch的时候，base中处理绑定this到当前图表
  let graph = this //graph为当前的qcharts对象 visula或者plugin
  if (!$el && !patche) {
    return
  }
  switch (patche.type) {
    case CREATE: {
      const { newVNode } = patche
      const newEl = createElement.bind(graph)(newVNode)
      if (newEl) {
        if (isRoot) {
          //创建的时候，visual与plugin绑定对应的sprite元素
          graph.$el = newEl
        }
        $el.appendChild(newEl)
      }
      break
    }
    case REPLACE: {
      const { newVNode } = patche
      const newEl = createElement.bind(graph)(newVNode)
      $el.parent.replaceChild(newEl, $el)
      break
    }
    case REMOVE: {
      $el.remove()
      break
    }
    case UPDATE: {
      const { attrs, children } = patche
      //对应的dom与vnode打上对应的ind，防止remove与create的时候变动i
      patchAttrs(graph, $el, attrs)
      if ($el.children && children.length) {
        $el.children.forEach((child, ind) => {
          child._ind = ind
        })
        children.forEach((child, ind) => {
          child._ind = ind
        })
        let len = children.length > $el.children.length ? children.length : $el.children.length
        for (let j = 0; j < len; j++) {
          let curNode = $el.children.filter(child => child._ind === j)[0]
          let curVnode = children.filter(child => child._ind === j)[0]
          if (curVnode && curVnode.type === 'CREATE') {
            //如果是create需要传父级$el
            patch.bind(graph)($el, curVnode, j)
          } else {
            patch.bind(graph)(curNode, curVnode, j)
          }
        }
      }
      break
    }
  }
}
