import { OnMessage } from './types'
import { getSelectionBorders } from './group'

function postBorders(): void {
  const data = {}
  getSelectionBorders().forEach(border => {
    data[border.node.id] = border.message
  })

  figma.ui.postMessage({
    type: 'border',
    data,
  })
}

figma.showUI(__html__, {
  width: 210,
  height: 80,
})

figma.on('selectionchange', () => {
  postBorders()
})

postBorders()

figma.ui.onmessage = (msg: OnMessage): void => {
  const borders = getSelectionBorders()
  if (msg.type === 'create-border') {
    if (borders.length < 1) {
      figma.notify('Select Frame.')
    } else {
      for (const border of borders) {
        if (border.getBorder(msg.position).length > 0) {         
          border.delBorder(msg.position)
        } else {          
          msg.weight = msg.weight == null || msg.weight == 0 ? 1 : msg.weight;
          console.log("HERE")
          console.log(msg.position)
          border.addBorder(msg.position, msg.weight)
        }
        postBorders()
      }
    }
  }
  if (msg.type === 'modify-border') {
    if (borders.length < 1) {
      figma.notify('Select Frame.')
    } else {
      for (const border of borders) {
        const temp = border
        if (border.getBorder(msg.position).length > 0) {
          //console.log(border.getBorder(msg.position))
//          border.delBorder(msg.position)
          //console.log( msg.weight)
          msg.weight = msg.weight == null || msg.weight <= 1 ? 1 : msg.weight;
          //console.log( msg.weight)
          //temp.addBorder(msg.position, msg.weight)
        }       
        postBorders()
      }
    }
  }
}
