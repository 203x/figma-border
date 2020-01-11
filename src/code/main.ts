import postBorders from './post'
import response from './response'

type Pos = 'top' | 'right' | 'bottom' | 'left'

interface Msg {
  type: 'create-border';
  position: Pos;
  weight: number;
}

figma.showUI(__html__, {
  width: 180,
  height: 80
})

figma.on("selectionchange", () => {
  postBorders()
})

postBorders()

figma.ui.onmessage = (msg: Msg) => {
  response(msg)
}
