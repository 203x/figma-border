type FrameLike = FrameNode | ComponentNode
type Pos = 'top' | 'right' | 'bottom' | 'left'
import postBorders from './post'
import {
  isFrameLike
} from './util'

interface Msg {
  type: 'create-border';
  position: Pos;
  weight: number;
}

function createBorder(node: FrameLike, position: Pos, weight: number) {
  const line = figma.createLine();
  line.name = 'Border_' + position
  line.strokeWeight = weight

  switch (position) {
    case 'top':
      line.x = 0
      line.y = 0 + weight
      line.resize(node.width, 0)

      line.constraints = {
        'horizontal': 'STRETCH',
        'vertical': 'MIN'
      }
      break
    case 'right':
      line.x = node.width - weight
      line.y = 0
      line.resize(node.height, 0)
      line.rotation = -90
      line.constraints = {
        'horizontal': 'MAX',
        'vertical': 'STRETCH'
      }
      break
    case 'bottom':
      line.x = 0
      line.y = node.height
      line.resize(node.width, 0)
      line.constraints = {
        'horizontal': 'STRETCH',
        'vertical': 'MAX'
      }
      break
    case 'left':
      line.x = 0
      line.y = 0
      line.resize(node.height, 0)
      line.rotation = -90
      line.constraints = {
        'horizontal': 'MIN',
        'vertical': 'STRETCH'
      }
      break
  }

  node.appendChild(line)
  return line
}

function response(msg: Msg) {
  if (msg.type === 'create-border') {
    if (figma.currentPage.selection.length < 1) {
      figma.notify('Select Frame.')
    }else{
      for (const node of figma.currentPage.selection.filter(isFrameLike)) {
        const childrens = node.children.filter(children=> {
          return children.type === 'LINE' && children.name === `Border_${msg.position}`
        })
        if (childrens.length < 1) {
          createBorder(node, msg.position, msg.weight)
        } else {
          for (const children of childrens) {
            children.remove()
          }
        }
        postBorders()
      }
    }
  }
}

export default response;
