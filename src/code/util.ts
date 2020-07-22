type FrameLike = FrameNode | ComponentNode //| InstanceNode
type Pos = 'top' | 'right' | 'bottom' | 'left'
const posArr = ['top', 'right', 'bottom', 'left']

function isFrameLike(node: BaseNode): node is FrameLike {
  // return node.type === 'FRAME' || node.type === 'COMPONENT' // || node.type === 'INSTANCE'
  return (
    (node.type === 'FRAME' || node.type === 'COMPONENT') &&
    node.layoutMode === 'NONE'
  )
}

function isFrameInstanceNode(node: BaseNode): boolean {
  return node.type === 'INSTANCE' && node.layoutMode === 'NONE'
}
function isBorderLine(node: SceneNode): node is LineNode {
  if (node.type === 'LINE') {
    const type = node.getPluginData('type')
    if (type === 'border') {
      var response = JSON.parse(node.getPluginData('position'));
      const position = response[0]      
      return posArr.includes(position)
    }
  }
  return false
}
function isBorderLineOld(node: BaseNode): boolean {
  const theName = posArr.map(pos => `Border_${pos}`)
  return node.type === 'LINE' && theName.includes(node.name)
}

function isBorderLineVisible(node: BaseNode): boolean {
  const theName = posArr.map(pos => `Border_${pos}`)
  return node.type === 'LINE' && theName.includes(node.name) && node.visible
}

function isGroup(node: SceneNode): node is GroupNode {
  if (node.type === 'GROUP') {
    const type = node.getPluginData('type')
    if (type === 'group') {
      return true
    }
  }
  return false
}

export {
  isFrameLike,
  isBorderLine,
  isGroup,
}
