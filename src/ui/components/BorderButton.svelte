<script>
  export let position;
  export let exist;

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function msg() {
    dispatch("msg", {
      position,
      exist
    });
  }
</script>

<style>
  button {
    display: inline-block;
    flex-shrink: 0;
    font-family: "Inter", sans-serif;
    text-transform: capitalize;

    padding: 8px;

    /* min-width: 8em; */

    border: 1px solid #fff;
    border-radius: 5px;
    outline: none;

    color: rgba(0, 0, 0, 0.8);
    background-color: #fff;

    /* transition: all 300ms; */
  }
  button:hover {
    border: 1px solid #ccc;
  }
  button.active:hover {
    border: 1px solid transparent;
  }
  button:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
  button:focus {
    /* border: 1px solid rgba(0, 0, 0, 0.3); */
  }
  button:disabled {
    background-color: rgba(0, 0, 0, 0.3);
  }
  button.active {
    /* border: 1px solid #28a6fa; */
    background-color: #28a6fa;
    color: white;
  }
</style>

<button on:click={msg} class:active={exist}>
  <slot />
</button>
