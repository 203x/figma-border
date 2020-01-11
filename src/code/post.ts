import {
  isFrameLike,
  isBorderLine
} from './util'

function check_selection(selection: ReadonlyArray<SceneNode>) {
  return selection.filter(isFrameLike).map(node => {
    // return node.children.filter(isBorderLine).map(children => children.name)
    return {
      'id': node.id,
      'border': node.children.filter(isBorderLine).map(children => {
        return {
          'id': children.id,
          'name': children.name
        }
      })
    }
  })
}

function postBorders() {
  console.log(figma.currentPage.selection)
  
  figma.ui.postMessage({
    type: 'border',
    data: check_selection(figma.currentPage.selection)
  })
}

export default postBorders;
