import { writable } from 'svelte/store'
import _ from 'lodash/array'

export const borders = writable([
  {
    position: 'left',
    exist: false
  },
  {
    position: 'right',
    exist: false
  },
  {
    position: 'top',
    exist: false
  },
  {
    position: 'bottom',
    exist: false
  }
])

window.onmessage = e => {
  const message = e.data.pluginMessage
  if (message.type === 'border') {
    borders.update(borders => {
      const index = _.findIndex(borders, { position: message.position })
      if (index >= 0) {
        borders[index].exist = message.data > 0 ? true : false
      }
      return borders
    })
  }
}
