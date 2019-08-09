function isFrame(node: BaseNode): node is FrameNode {
  return (node as FrameNode).type === 'FRAME'
}
//
type Pos = 'top' | 'right' | 'bottom' | 'left'

function createBorder(node: FrameNode, position: Pos, weight: number) {
  const line = figma.createLine();
  line.name = 'Border_' + position
  line.strokeWeight = weight

  if (position === 'top') {
    line.x = 0
    line.y = 0 + weight
    line.resize(node.width, 0)

    line.constraints = {
      'horizontal': 'STRETCH',
      'vertical': 'MIN'
    }
  } else if (position === 'right') {
    line.x = node.width - weight
    line.y = 0
    line.resize(node.height, 0)
    line.rotation = -90
    line.constraints = {
      'horizontal': 'MAX',
      'vertical': 'STRETCH'
    }
  } else if (position === 'bottom') {
    line.x = 0
    line.y = node.height
    line.resize(node.width, 0)
    line.constraints = {
      'horizontal': 'STRETCH',
      'vertical': 'MAX'
    }
  } else if (position === 'left') {
    line.x = 0
    line.y = 0
    line.resize(node.height, 0)
    line.rotation = -90
    line.constraints = {
      'horizontal': 'MIN',
      'vertical': 'STRETCH'
    }
  }
  node.appendChild(line)
}

function getBorder(node: FrameNode, position: Pos): LineNode[] {
  const nodes = []
  for (const children of node.children) {
    if ((children.type === 'LINE') && (children.name === 'Border_' + position)) {
      nodes.push(children)
    }
  }
  return nodes
}

function postBorders() {
  for (const node of figma.currentPage.selection) {
    if (isFrame(node)) {
      const pos_arr: Pos[] = ['top', 'right', 'bottom', 'left']
      for (const pos of pos_arr) {
        const nodes = getBorder(node, pos)
        figma.ui.postMessage({
          type: 'border',
          position: pos,
          data: nodes.length
        })
      }
    }
  }
}

if (figma.currentPage.selection.length < 1) {
  figma.closePlugin('Select Frame.')
}

figma.showUI(__html__, {
  width: 180,
  height: 80
});

postBorders()

interface Msg {
  type: string;
  position: Pos;
  weight: number;
}

figma.ui.onmessage = (msg: Msg) => {

  if (msg.type === 'create-border') {
    if (figma.currentPage.selection.length < 1) {
      figma.closePlugin('Select Frame.')
    }
    for (const node of figma.currentPage.selection) {
      if (isFrame(node)) {
        const nodes = getBorder(node, msg.position)
        if (nodes.length < 1) {
          createBorder(node, msg.position, msg.weight)
        } else {
          for (const node of nodes) {
            node.remove()
          }
          figma.ui.postMessage({
            type: 'border',
            position: msg.position,
            data: 0
          })
        }
        postBorders()
      }
    }
  }
};
