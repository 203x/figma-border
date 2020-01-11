import { writable } from "svelte/store";

export const borders = writable([
  {
    position: "left",
    exist: false
  },
  {
    position: "right",
    exist: false
  },
  {
    position: "top",
    exist: false
  },
  {
    position: "bottom",
    exist: false
  }
]);

window.onmessage = e => {
  const pos_arr = ["left", "right", "top", "bottom"];
  const pos_arr_name = pos_arr.map(pos => `Border_${pos}`);
  const message = e.data.pluginMessage;
  if (message.type === "border") {
    
    borders.update(() => {
      if (message.data.length === 0) {
        return []
      }

      const borders = pos_arr.map(pos => {
        return {
          position: pos,
          exist: false
        };
      });

      message.data.forEach(node => {
        node.border.forEach(children => {
          const index = pos_arr_name.indexOf(children.name);
          if (index >= 0) {
            borders[index].exist = true;
          }
        });
      });

      return borders;
    });
  }
};
