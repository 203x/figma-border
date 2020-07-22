import { isFrameLike, isBorderLine, isGroup, isBorderGroup } from './util'
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
        if (isBorderGroup(children)) {
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
      this._group.setPluginData('BorderChild', 'true')
    }
  }

  addBorder(position: Pos, weight = 1): LineNode {
    var groupY = 0 , groupX = 0;



    if(isGroup(this.node)){
      groupY = this.node.y
      groupX = this.node.x
    }


    const line = figma.createLine()
    line.name = position    
    line.strokeWeight = weight

    switch (position) {
      case 'top':
        line.x = groupX
        line.y = 0 + weight + groupY
        line.resize(this.node.width, 0)

        line.constraints = {
          horizontal: 'STRETCH',
          vertical: 'MIN',
        }
        break
      case 'right':
        line.x = groupX + this.node.width - weight
        line.y = groupY
        line.resize(this.node.height, 0)
        line.rotation = -90
        line.constraints = {
          horizontal: 'MAX',
          vertical: 'STRETCH',
        }
        break
      case 'bottom':
        line.x = groupX
        line.y = this.node.height + groupY
        line.resize(this.node.width, 0)
        line.constraints = {
          horizontal: 'STRETCH',
          vertical: 'MAX',
        }
        break
      case 'left':
        line.x = groupX
        line.y = groupY
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
  console.log(node.getPluginData("BorderParent"))
  console.log(node)
  if (isFrameLike(node)) {
    console.log(1)
    return new BorderFrame(node)
  } else if (isGroup(node) && node.getPluginData("BorderParent") === "true" &&  node.getPluginData("BorderChild") != "true" ){
    console.log(2)
    node.setPluginData("BorderParent", "false")    
    return new BorderFrame(node)
  } else  if (isBorderLine(node) && node.parent.type === 'GROUP') {
    console.log(3)
    return getBorderFrame(node.parent)
  } else if (
    isBorderGroup(node) &&
    (node.parent.type === 'COMPONENT' ||
      node.parent.type === 'FRAME' ||
      node.parent.type === 'GROUP')
  ) {
    console.log(4)
    return getBorderFrame(node.parent)
  }  else {
    console.log(6)
    return null
  }
}

function getSelectionBorders(): BorderFrame[] {
  const selection = figma.currentPage.selection
  const borders: BorderFrame[] = []
  selection.forEach(node => {
    node.setPluginData("BorderParent", "true")    
    const border = getBorderFrame(node)
    if (border) {
      borders.push(border)
    }
  })
  return borders
}

export { BorderFrame, getSelectionBorders }
