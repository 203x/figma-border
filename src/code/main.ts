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
  width: 180,
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
          border.addBorder(msg.position, msg.weight)
        }
        postBorders()
      }
    }
  }
}
