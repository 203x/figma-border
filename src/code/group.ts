import { isFrameLike, isBorderLine, isGroup } from './util'
import { Pos, FrameLike } from './types'

class BorderFrame {
  node: FrameLike
  private _group: GroupNode

  constructor(node: FrameLike) {
    this.node = node
  }

  get group(): GroupNode {
    if (!this._group) {
      for (const children of this.node.children) {
        if (isGroup(children)) {
          this._group = children
        }
      }
    }
    return this._group
  }

  get allBorder(): LineNode[] {
    if (this.group) {      
      return this.group.children.filter(isBorderLine)
    } else {
      return []
    }
  }

  get message(): { [id: string]: Pos } {
    if (!this.group) {
      return {}
    }
    const border = {}
    for (const line of this.allBorder) {
      border[line.id] = { 0 : line.name ,1 : line.strokeWeight}   
    }
    return border
    
  }

  initGroup(lines: LineNode[]): void {
    if (!this._group) {
      this._group = figma.group(lines, this.node)
      this._group.expanded = false
      this._group.name = 'Border'
      this._group.setRelaunchData({ edit: '' })
      this._group.setPluginData('type', 'group')
    }
  }

  addBorder(position: Pos, weight = 1): LineNode {
    const line = figma.createLine()
    line.name = position    
    line.strokeWeight = weight

    switch (position) {
      case 'top':
        line.x = 0
        line.y = 0 + weight
        line.resize(this.node.width, 0)

        line.constraints = {
          horizontal: 'STRETCH',
          vertical: 'MIN',
        }
        break
      case 'right':
        line.x = this.node.width - weight
        line.y = 0
        line.resize(this.node.height, 0)
        line.rotation = -90
        line.constraints = {
          horizontal: 'MAX',
          vertical: 'STRETCH',
        }
        break
      case 'bottom':
        line.x = 0
        line.y = this.node.height
        line.resize(this.node.width, 0)
        line.constraints = {
          horizontal: 'STRETCH',
          vertical: 'MAX',
        }
        break
      case 'left':
        line.x = 0
        line.y = 0
        line.resize(this.node.height, 0)
        line.rotation = -90
        line.constraints = {
          horizontal: 'MIN',
          vertical: 'STRETCH',
        }
        break
    }
    line.setRelaunchData({ edit: '' })
    line.setPluginData('type', 'border')
    line.setPluginData('position', JSON.stringify({0: position, 1: line.strokeWeight }))
    this.node.appendChild(line)
    if (this.group) {
      this.group.appendChild(line)
    } else {
      this.initGroup([line])
    }
    return line
  }

  getBorder(position: Pos): string[] {
    const ids: string[] = []
    for (const line of this.allBorder) {
      if (position === line.name) {
        ids.push(line.id)
      }
    }    
    return ids
  }

  delBorder(position: Pos): void {
    this.getBorder(position).forEach(id => {
      figma.getNodeById(id).remove()
    })
  }
  delBorderID(ids: Array<string>): void {
    ids.forEach(id => {
      figma.getNodeById(id).remove()
    })    
  }

  toggleBorder(position: Pos, weight = 1): void {
    const ids = this.getBorder(position)
    if (ids.length > 0) {
      this.delBorder(position)
    } else {
      this.addBorder(position, weight)
    }
  }
}

function getBorderFrame(node: SceneNode): BorderFrame {
  if (isFrameLike(node)) {
    return new BorderFrame(node)
  } else if (isBorderLine(node) && node.parent.type === 'GROUP') {
    return getBorderFrame(node.parent)
  } else if (
    isGroup(node) &&
    (node.parent.type === 'COMPONENT' ||
      node.parent.type === 'FRAME' ||
      node.parent.type === 'GROUP')
  ) {
    return getBorderFrame(node.parent)
  } else {
    return null
  }
}

function getSelectionBorders(): BorderFrame[] {
  const selection = figma.currentPage.selection
  const borders: BorderFrame[] = []
  selection.forEach(node => {
    const border = getBorderFrame(node)
    if (border) {
      borders.push(border)
    }
  })
  return borders
}

export { BorderFrame, getSelectionBorders }
