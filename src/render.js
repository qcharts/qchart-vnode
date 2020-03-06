import { patchAttrs } from './patch'
export function createElement(vnode) {
  if (!vnode) {
    return
  }
  //当前图形通过绑定this传递进来
  let graph = this
  let { tagName: TagName, attrs, children } = vnode
  const el = new TagName()
  //渲染的spritejs对象放到 visual或者plugin上
  patchAttrs(graph, el, attrs)
  if (el.appendChild) {
    children
      .map(createElement.bind(this))
      .filter(Boolean)
      .forEach(el.appendChild.bind(el))
  }
  return el
}
