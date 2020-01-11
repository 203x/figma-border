type FrameLike = FrameNode | ComponentNode // | InstanceNode
type Pos = 'top' | 'right' | 'bottom' | 'left'

function isFrameLike(node: BaseNode) {
  // return node.type === 'FRAME' || node.type === 'COMPONENT' // || node.type === 'INSTANCE'
  return node.type === 'FRAME' || node.type === 'COMPONENT' || node.layoutMode === 'NONE'
}

function isBorderLine(node: BaseNode) {
  const pos_arr: Pos[] = ['top', 'right', 'bottom', 'left']
  const pos_arr_name = pos_arr.map(pos => `Border_${pos}`)
  return node.type === 'LINE' && pos_arr_name.includes(node.name)
}
function isBorderLineVisible(node: BaseNode) {
  const pos_arr: Pos[] = ['top', 'right', 'bottom', 'left']
  const pos_arr_name = pos_arr.map(pos => `Border_${pos}`)
  return node.type === 'LINE' && pos_arr_name.includes(node.name) && node.visible
}
function getBorderLine(node: FrameLike, position: Pos) {
  return node.children.filter(children=> {
    return children.type === 'LINE' && children.name === `Border_${position}`
  })
}

export {
  isFrameLike,
  isBorderLine,
  isBorderLineVisible,
  getBorderLine,
};
