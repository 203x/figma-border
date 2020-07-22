import { writable } from 'svelte/store'

export const borders = writable([
  {
    position: 'left',
    weight: 0,
    exist: false,
  },
  {
    position: 'right',
    weight: 0,
    exist: false,
  },
  {
    position: 'top',
    weight: 0,
    exist: false,
  },
  {
    position: 'bottom',
    weight: 0,
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

      var borders = pos_arr.map(pos => {        
        return {
          position: pos,
          weight: 0,          
          exist: false,
        }
      })

      
      Object.keys(message.data).forEach(id => {
        Object.keys(message.data[id]).forEach(borderId => {          
          const index = pos_arr.indexOf(message.data[id][borderId][0])
          const size = message.data[id][borderId][1]
          if (index >= 0) {
            borders[index].exist = true
            borders[index].weight = size
          }
          
        })
      })     
      return borders
    })
  }
}
