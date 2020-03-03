export type Pos = 'top' | 'right' | 'bottom' | 'left'
export type FrameLike = FrameNode | ComponentNode //| InstanceNode

interface PluginDataBorder {
  type: 'border'
  position: Pos
}

interface PluginDataGroup {
  type: 'group'
}

export interface PostMessage {
  type: 'border'
  data: {
    [groupId: string]: {
      [borderId: string]: Pos
    }
  }
}

export interface OnMessage {
  type: 'create-border'
  position: Pos
  weight?: number
}
