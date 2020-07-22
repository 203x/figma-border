<script>
  export let position;
  export let exist;
  export var weight;

  import { createEventDispatcher } from "svelte";
  import { borders } from "../stores";

  const dispatch = createEventDispatcher();

  function toggle() {
    dispatch("msg", {
      action : 'create-border',
      position,
      weight,
      exist
    });
  }

  function mod() {
    dispatch("msg", {
      action : 'modify-border',
      position,
      weight,
      exist
    });
  }
</script>

<style>
  div{
    text-align:center;
  }
  
  input {
    width: 40px;
    height: 20px;
    text-align: right;
  }
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

<div>
  <button on:click={toggle} class:active={exist}>
    <slot />
  </button>
</div>
<div>
  <input type="number" on:change={mod} bind:value={weight}/> 
</div>