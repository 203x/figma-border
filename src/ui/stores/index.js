import { writable } from 'svelte/store'

export const borders = writable([
  {
    position: 'left',
    exist: false,
  },
  {
    position: 'right',
    exist: false,
  },
  {
    position: 'top',
    exist: false,
  },
  {
    position: 'bottom',
    exist: false,
  },
])

window.onmessage = e => {
  const pos_arr = ['left', 'right', 'top', 'bottom']
  const message = e.data.pluginMessage
  if (message.type === 'border') {
    borders.update(() => {
      
      if (Object.keys(message.data).length === 0) {
        return []
      }

      const borders = pos_arr.map(pos => {
        return {
          position: pos,
          exist: false,
        }
      })

      Object.keys(message.data).forEach(id => {
        Object.keys(message.data[id]).forEach(borderId => {
          const index = pos_arr.indexOf(message.data[id][borderId])
          if (index >= 0) {
            borders[index].exist = true
          }
        })
      })

      return borders
    })
  }
}
