export type Pos = 'top' | 'right' | 'bottom' | 'left'
export type FrameLike = FrameNode | ComponentNode //| InstanceNode
export type Actions = 'create-border' | 'modify-border'

interface PluginDataBorder {
  type: 'border'
  position: Pos,
  weight: number
}

interface PluginDataGroup {
  type: 'group'
}

export interface PostMessage {
  type: 'border'
  data: {
    [groupId: string]: {
      [borderId: string]: {
        Pos,
        number
      }
    }
  }
}

export interface OnMessage {
  type: Actions
  position: Pos
  weight?: number
}
