<script>
  import BorderButton from "./components/BorderButton.svelte";
  import BorderIcon from "./components/BorderIcon.svelte";
  import { borders } from "./stores";

  

  function msg({detail}) {
    const weight = 1

    if (detail.position) {
      parent.postMessage(
        { pluginMessage: { type: 'create-border', position:detail.position, weight } },
        '*'
      )
    }

  }
</script>

<style>
ul {
  margin-top: 10px;
  margin-bottom: 10px;
}
ul li {
  display: inline-block;
  margin-bottom: 5px;
  /* font-size: 1.5em; */
}
</style>

<ul class="inner">
  {#each $borders as border (border.position)}
    <li>
      <BorderButton on:msg={msg} {...border} >
        <BorderIcon position={border.position}/>
      </BorderButton>
    </li>
  {/each}
</ul>
